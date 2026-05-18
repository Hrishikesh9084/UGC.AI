import * as Sentry from "@sentry/node";
import { prisma } from "../configs/prisma.js";
// Get user credits
export const getUserCredits = async (req, res) => {
    try {
        const { userId } = req.auth();
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ credits: user?.credits });
    }
    catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.message });
        console.log(error);
    }
};
// const get all user projects
export const getAllProjects = async (req, res) => {
    try {
        const { userId } = req.auth();
        const projects = await prisma.project.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ projects });
    }
    catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.message });
        console.log(error);
    }
};
// get project by id
export const getProjectById = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { projectId } = req.params;
        const project = await prisma.project.findUnique({
            where: { id: projectId, userId },
        });
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        res.json({ project });
    }
    catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.message });
        console.log(error);
    }
};
// publish / unpublish project
export const toggleProjectPublic = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { projectId } = req.params;
        const project = await prisma.project.findUnique({
            where: { id: projectId, userId },
        });
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        if (!project?.generatedImage && !project?.generatedVideo) {
            return res.status(404).json({ error: "Image or video not generated" });
        }
        await prisma.project.update({
            where: { id: projectId },
            data: { isPublished: !project.isPublished }
        });
        res.json({ isPublished: !project.isPublished });
    }
    catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.message });
        console.log(error);
    }
};
