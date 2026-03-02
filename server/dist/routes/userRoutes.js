"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_js_1 = require("../controllers/userController.js");
const auth_js_1 = require("../middlewares/auth.js");
const userRouter = express_1.default.Router();
userRouter.get('/credits', auth_js_1.protect, userController_js_1.getUserCredits);
userRouter.get('/projects', auth_js_1.protect, userController_js_1.getAllProjects);
userRouter.get('/projects/:projectId', auth_js_1.protect, userController_js_1.getProjectById);
userRouter.get('/publish/:projectId', auth_js_1.protect, userController_js_1.toggleProjectPublic);
exports.default = userRouter;
