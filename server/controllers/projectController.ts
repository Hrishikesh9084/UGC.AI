import { Request, Response } from "express";
import * as Sentry from '@sentry/node'
import { prisma } from "../configs/prisma.js";
import { v2 as cloudinary } from 'cloudinary';
import { GenerateContentConfig, HarmBlockThreshold, HarmCategory } from '@google/genai';
import fs from 'fs';
import path from 'path'
import ai from "../configs/ai.js";
import axios from "axios";
import { error } from "console";

const loadImage = (path: string, mimeType: string) => {
    return {
        inlineData: {
            data: fs.readFileSync(path).toString('base64'),
            mimeType,
        }
    }
}

// create project
export const createProject = async (req: Request, res: Response) => {

    let tempProjectId: string;
    const { userId } = req.auth();
    let isCreditDeducted = false;

    const { name = 'New Project', aspectRatio, userPrompt, productName, productDescription, targetLength = 5 } = req.body;

    const images: any = req.files;

    if (images.length < 2 || !productName) {
        return res.status(400).json({ message: "Please provide at least 2 images." });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId }
    })

    if (!user || user.credits < 5) {
        return res.status(401).json({ message: 'Insufficient credits' });
    } else {
        // Deduct 5 credits for project creation
        await prisma.user.update({
            where: { id: userId },
            data: { credits: { decrement: 5 } }
        }).then(() => {
            isCreditDeducted = true
        })
    }

    try {

        let uploadedImages = await Promise.all(images.map(async (item: any) => {
            let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
            return result.secure_url;
        })
        )
        const project = await prisma.project.create({
            data: {
                name,
                userId,
                productName,
                productDescription,
                userPrompt,
                aspectRatio,
                targetLength: parseInt(targetLength),
                uploadedImages,
                isGenerating: true
            }
        })

        tempProjectId = project.id;

        // const model = 'gemini-3-pro-image-preview';
        const model = 'gemini-3-pro-image-preview';

        const generationConfig: GenerateContentConfig = {
            maxOutputTokens: 32768,
            temperature: 1,
            topP: 0.95,
            responseModalities: ["IMAGE"],
            imageConfig: {
                aspectRatio: aspectRatio || '9:16',
                imageSize: '1K',
            },
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.OFF,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.OFF,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.OFF,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.OFF,
                },
            ]
        }

        // Image to base64 structure for ai prompt
        const img1base64 = loadImage(images[0].path, images[0].mimetype)
        const img2base64 = loadImage(images[1].path, images[1].mimetype)

        const prompt = {
            text: `Combine the person and Proudest into a realistic photo.
             Make the person naturally hold or use the product.
            Match lighting, shadows, tails and Perspective.
            Make the person stand in professional studio lighting. 
            OutPut ecommerce-quality photo relistic imagery ${userPrompt}`
        }

        // Generate image using google gen ai
        const response: any = await ai.models.generateContent({
            model,
            contents: [img1base64, img2base64, prompt],
            config: generationConfig,
        })

        // check if response is vaild
        if (!response?.candidates?.[0]?.content?.parts) {
            throw new Error('Unexpected response');
        }

        const parts = response.candidates[0].content.parts;

        let finalBuffer: Buffer | null = null

        for (const part of parts) {
            if (part.inlineData) {
                finalBuffer = Buffer.from(part.inlineData.data, 'base64')
            }
        }

        if (!finalBuffer) {
            throw new Error('Failed to generate image');
        }

        const base64Image = `data:image/png;base64,${finalBuffer.toString('base64')}`;

        const uploadResult = await cloudinary.uploader.upload(base64Image, { resource_type: 'image' })

        await prisma.project.update({
            where: { id: project.id },
            data: {
                generatedImage: uploadResult.secure_url,
                isGenerating: false
            }
        })

        res.json({ projectId: project.id })

    } catch (error: any) {
        if (tempProjectId!) {
            // Update project status and error message
            await prisma.project.update({
                where: {
                    id: tempProjectId,
                },
                data: { isGenerating: false, error: error.message }
            })
        }
        if (isCreditDeducted) {
            // add credit back
            await prisma.user.update({
                where: { id: userId },
                data: { credits: { increment: 5 } }
            })
        }
        Sentry.captureException(error);
        res.status(500).json({ message: error.message });
    }
}

// Create video
export const createVideo = async (req: Request, res: Response) => {

    const { userId } = req.auth();
    const { projectId } = req.body as { projectId: string };
    let isCreditDeducted = false;

    const user = await prisma.user.findUnique({
        where: { id: userId }
    })

    if (!user || user.credits < 10) {
        return res.status(401).json({ message: 'Insufficient credits' });
    }

    // Deduct 10 credits for video generation
    await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 10 } }
    }).then(() => {
        isCreditDeducted = true;
    })

    try {

        const project = await prisma.project.findUnique({
            where: { id: projectId, userId },
            include: { user: true }
        })

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.isGenerating) {
            return res.status(400).json({ message: 'A generation is already in progress' });
        }

        if (project.generatedVideo) {
            return res.status(404).json({ message: 'Video already generated' });
        }

        await prisma.project.update({
            where: { id: projectId },
            data: { isGenerating: true }
        })

        const prompt = ` Make the person showcase the product which is ${project.productName} ${project.productDescription && `and Product Description: ${project.productDescription}`}`

        const model = 'veo-3.1-generate-preview';

        if (!project.generatedImage) {
            throw new Error('Generated image not found');
        }

        const image = await axios.get(project.generatedImage, { responseType: 'arraybuffer' });

        const imageBytes: any = Buffer.from(image.data)
        let operation: any = await ai.models.generateVideos({
            model,
            prompt,
            image: {
                imageBytes: imageBytes.toString('base64'),
                mimeType: 'image/png',
            },
            config: {
                aspectRatio: project?.aspectRatio || '9:16',
                numberOfVideos: 1,
                resolution: '720p',
            }
        })

        while (!operation.done) {
            console.log("Waiting for video generation to complete...")
            await new Promise((resolve) => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({
                operation: operation,
            })
        }

        const filename = `${userId}-${Date.now()}.mp4`;
        const filepath = path.join('videos', filename);

        fs.mkdirSync('videos', { recursive: true });

        if (!operation.response || !operation.response.generatedVideos || operation.response.generatedVideos.length === 0) {
            let errorMessage = 'Video generation failed';
            if (operation.response && operation.response.raiMediaFilteredReason && operation.response.raiMediaFilteredReason.length > 0) {
                errorMessage = `Video generation failed due to content filtering: ${operation.response.raiMediaFilteredReason[0]}`;
                console.error('Video generation failed due to RAI filters. Reason:', operation.response.raiMediaFilteredReason[0]);
            }
            console.error('Video generation failed. Full operation object:', JSON.stringify(operation, null, 2));
            throw new Error(errorMessage);
        }

        //  Download the video
        await ai.files.download({
            file: operation.response.generatedVideos[0].video,
            downloadPath: filepath
        })

        const uplaodResult = await cloudinary.uploader.upload(filepath, {
            resource_type: 'video',
        })

        await prisma.project.update({
            where: { id: project.id },
            data: {
                generatedVideo: uplaodResult.secure_url,
                isGenerating: false
            }
        })

        // Remove video file from disk after uplaod
        fs.unlinkSync(filepath);

        res.json({ message: 'Video generated successfully', videoUrl: uplaodResult.secure_url });

    } catch (error: any) {

        // Update project status and error message
        await prisma.project.update({
            where: {
                id: projectId, userId
            },
            data: { isGenerating: false, error: error.message }
        })
        if (isCreditDeducted) {
            // add credit back
            await prisma.user.update({
                where: { id: userId },
                data: { credits: { increment: 10 } }
            })
        }
        Sentry.captureException(error);
        res.status(500).json({ message: error.message });
    }
}

// Get all published projects
export const getAllPublishedProjects = async (req: Request, res: Response) => {
    try {

        const projects = await prisma.project.findMany({
            where: { isPublished: true }
        })

        res.json({ projects })

    } catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.message });
    }
}

// delete project

export const deleteProject = async (req: Request, res: Response) => {
    try {

        const { userId } = req.auth();
        const { projectId } = req.params as { projectId: string };

        const project = await prisma.project.findUnique({
            where: { id: projectId, userId },
        })

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await prisma.project.delete({
            where: { id: projectId },
        })

        res.json({ message: 'Project deleted successfully' });

    } catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.message });
    }
}
