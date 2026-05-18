import express from "express";
import { createProject, createVideo, deleteProject, getAllPublishedProjects, getPublishedProjectById } from "../controllers/projectController.js";
import { protect } from "../middlewares/auth.js";
import upload from "../configs/multer.js";

const projectRouter = express.Router();

projectRouter.post('/create', upload.array('images', 2), protect, createProject);
projectRouter.post('/video', protect, createVideo);
projectRouter.get('/published', getAllPublishedProjects);
projectRouter.get('/published/:projectId', getPublishedProjectById);
projectRouter.delete('/:projectId', protect, deleteProject);


export default projectRouter;