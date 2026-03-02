"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_js_1 = require("../controllers/projectController.js");
const auth_js_1 = require("../middlewares/auth.js");
const multer_js_1 = __importDefault(require("../configs/multer.js"));
const projectRouter = express_1.default.Router();
projectRouter.post('/create', multer_js_1.default.array('images', 2), auth_js_1.protect, projectController_js_1.createProject);
projectRouter.post('/video', auth_js_1.protect, projectController_js_1.createVideo);
projectRouter.get('/published', projectController_js_1.getAllPublishedProjects);
projectRouter.delete('/:projectId', auth_js_1.protect, projectController_js_1.deleteProject);
exports.default = projectRouter;
