import { UploadIcon, Zap, Video } from "lucide-react";
import type { IFeature } from "../types";

export const features: IFeature[] = [
    {
        title: "Smart Upload",
        description:
            "Drag & drop your assets. We auto-optimize formats and sizes.",
        icon: UploadIcon
    },
    {
        title: "Instant Generation",
        description:
            "Optimized models deliver output in seconds with great fidelity.",
        icon: Zap
    },
    {
        title: "Video Synthesis",
        description:
            "Bring product shots to life with short-form, social-ready videos.",
        icon: Video
    },
]