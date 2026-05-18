import { Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';
import * as Sentry from "@sentry/node";

export const createVoiceAgent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, voiceURI, pitch, rate, description, userId } = req.body;

        if (!name || !voiceURI || !userId) {
            res.status(400).json({ success: false, message: 'Missing required fields' });
            return;
        }

        const newAgent = await prisma.voiceAgent.create({
            data: {
                name: String(name),
                voiceURI: String(voiceURI),
                pitch: parseFloat(pitch as string) || 1.0,
                rate: parseFloat(rate as string) || 1.0,
                description: description ? String(description) : '',
                userId: String(userId)
            }
        });

        res.status(201).json({ success: true, agent: newAgent });
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error creating voice agent:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

import axios, { AxiosError } from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import * as googleTTS from 'google-tts-api';

export const generateSpeech = async (req: Request, res: Response): Promise<void> => {
    try {
        const { text, voiceURI, pitch, rate } = req.body;

        if (!text || !voiceURI) {
            res.status(400).json({ success: false, message: 'Missing text or voiceURI' });
            return;
        }

        const isHuggingFace = voiceURI.startsWith('hf_');

        if (isHuggingFace) {
            // Hugging Face TTS Integration
            const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || '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';
            
            // Map the frontend identifier to the actual Hugging Face model
            let modelName = 'espnet/kan-bayashi_ljspeech_vits'; // default fallback
            if (voiceURI === 'hf_ljspeech') modelName = 'espnet/kan-bayashi_ljspeech_vits';
            if (voiceURI === 'hf_vctk') modelName = 'suno/bark-small'; // Using bark as another option

            try {
                const hfResponse = await axios.post(
                    `https://api-inference.huggingface.co/models/${modelName}`,
                    { inputs: text },
                    {
                        headers: {
                            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
                            "Content-Type": "application/json",
                        },
                        responseType: 'arraybuffer'
                    }
                );

                const audioBase64 = Buffer.from(hfResponse.data).toString('base64');
                res.status(200).json({ success: true, audioContent: audioBase64 });
                return;
            } catch (hfError: unknown) {
                console.error("Hugging Face API Error:", hfError);
                // Fallback to Google if HF fails (e.g., model loading or rate limit)
                console.log("Falling back to Google TTS...");
            }
        }

        // ElevenLabs voice IDs are alphanumeric strings usually 20-21 characters long.
        const isElevenLabs = !voiceURI.includes('-') && voiceURI.length > 10 && !isHuggingFace;

        if (isElevenLabs) {
            // ElevenLabs TTS (Custom Cloned Voices & Premium Default Voices)
            const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
            if (!ELEVENLABS_API_KEY) {
                res.status(400).json({ success: false, message: "ELEVENLABS_API_KEY is not set in backend. Please set it to use voice cloning." });
                return;
            }

            try {
                const response = await axios.post(
                    `https://api.elevenlabs.io/v1/text-to-speech/${voiceURI}`,
                    {
                        text: text,
                        model_id: "eleven_multilingual_v2",
                    },
                    {
                        headers: {
                            'xi-api-key': ELEVENLABS_API_KEY,
                            'Content-Type': 'application/json',
                        },
                        responseType: 'arraybuffer'
                    }
                );

                const audioBase64 = Buffer.from(response.data).toString('base64');
                res.status(200).json({ success: true, audioContent: audioBase64 });
                return;
            } catch (elError: unknown) {
                if (axios.isAxiosError(elError) && elError.response?.status === 402) {
                    console.error("ElevenLabs Out of Credits (402)");
                    res.status(402).json({ success: false, message: 'Your ElevenLabs account has run out of credits. Please upgrade your tier or use the free basic voices.' });
                    return;
                }
                throw elError;
            }
        }

        // Use free google-tts-api for everything else (or fallback)
        // If they saved an old 'en-US-Journey-D', we'll extract the first part 'en-US' to prevent errors.
        let langCode = 'en-US';
        if (voiceURI === 'en' || voiceURI === 'en-US' || voiceURI === 'en-GB') {
            langCode = voiceURI;
        } else if (voiceURI.startsWith('en-')) {
            langCode = voiceURI.substring(0, 5); // Extract 'en-US' or 'en-GB'
        }

        const url = googleTTS.getAudioUrl(text, {
            lang: langCode,
            slow: rate && parseFloat(rate) < 1.0,
            host: 'https://translate.google.com',
        });

        // Download the audio buffer
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const audioBase64 = Buffer.from(response.data).toString('base64');
        
        res.status(200).json({ success: true, audioContent: audioBase64 });

    } catch (error: unknown) {
        Sentry.captureException(error);
        console.error("Error generating speech:", error);
        res.status(500).json({ success: false, message: 'Internal server error during speech generation' });
    }
};

export const cloneVoice = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description } = req.body;
        const file = req.file;

        if (!name || !file) {
            res.status(400).json({ success: false, message: 'Missing name or audio file' });
            return;
        }

        const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
        if (!ELEVENLABS_API_KEY) {
            throw new Error("ELEVENLABS_API_KEY is not set in backend environment variables.");
        }

        const formData = new FormData();
        formData.append('name', name);
        if (description) formData.append('description', description);
        formData.append('files', fs.createReadStream(file.path), {
            filename: file.originalname,
            contentType: file.mimetype,
        });

        const response = await axios.post(
            'https://api.elevenlabs.io/v1/voices/add',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'xi-api-key': ELEVENLABS_API_KEY
                }
            }
        );

        fs.unlinkSync(file.path);

        if (response.data.voice_id) {
            res.status(200).json({ success: true, voiceId: response.data.voice_id });
        } else {
            res.status(500).json({ success: false, message: 'Failed to clone voice' });
        }

    } catch (error) {
        Sentry.captureException(error);
        console.error("Error cloning voice:", error);
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ success: false, message: 'Internal server error during voice cloning' });
    }
};

export const updateVoiceAgent = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = String(req.params.id);
        const body = req.body as {
            name?: string;
            voiceURI?: string;
            pitch?: string | number;
            rate?: string | number;
            description?: string;
            userId?: string;
        };
        const userId = body.userId;

        if (!id || !userId) {
            res.status(400).json({ success: false, message: 'Missing required fields' });
            return;
        }

        // Verify ownership
        const existing = await prisma.voiceAgent.findUnique({ where: { id } });
        if (!existing || existing.userId !== userId) {
            res.status(403).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const updatedAgent = await prisma.voiceAgent.update({
            where: { id },
            data: {
                name: body.name,
                voiceURI: body.voiceURI,
                pitch: body.pitch !== undefined ? parseFloat(String(body.pitch)) : undefined,
                rate: body.rate !== undefined ? parseFloat(String(body.rate)) : undefined,
                description: body.description
            }
        });

        res.status(200).json({ success: true, agent: updatedAgent });
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error updating voice agent:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const deleteVoiceAgent = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = String(req.params.id);
        const rawUserId = req.query.userId;
        const userId = typeof rawUserId === 'string' ? rawUserId : undefined;

        if (!id || !userId) {
            res.status(400).json({ success: false, message: 'Missing required fields' });
            return;
        }

        // Verify ownership
        const existing = await prisma.voiceAgent.findUnique({ where: { id } });
        if (!existing || existing.userId !== userId) {
            res.status(403).json({ success: false, message: 'Unauthorized' });
            return;
        }

        await prisma.voiceAgent.delete({
            where: { id }
        });

        res.status(200).json({ success: true, message: 'Voice agent deleted successfully' });
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error deleting voice agent:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const getVoiceAgents = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.query.userId as string;

        if (!userId) {
            res.status(400).json({ success: false, message: 'Missing userId' });
            return;
        }

        const agents = await prisma.voiceAgent.findMany({
            where: {
                userId: String(userId)
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({ success: true, agents });
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching voice agents:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
