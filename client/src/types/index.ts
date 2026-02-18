import type { LucideIcon } from "lucide-react";
import type React from "react";

export interface IFeature {
    icon: LucideIcon;
    title: string;
    description: string;
};

export interface IWork {
    title: string;
    image: string;
}

export interface ITestimonial {
    id: number;
    name: string;
    title: string;
    quote: string;
    avatar: string;
    handle: string;
    rating: 1 | 2 | 3 | 4 | 5;
}

export interface IFaq {
    question: string;
    answer: string;
}

export interface UploadZoneProps {
    label: string;
    file: File | null;
    onClear: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface User {
    id: string;
    name?: string;
    email: string;
}

export interface Project {
    id: string;
    name?: string;
    userId?: string;
    user?: User;
    productName: string;
    productDescription: string;
    userPrompt: string;
    aspectRatio: string;
    targetLength: number;
    generatedImage?: string;
    generatedVideo?: string;
    isGenerating: boolean;
    isPublished: boolean;
    error?: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    uploadedImages: string[]
}