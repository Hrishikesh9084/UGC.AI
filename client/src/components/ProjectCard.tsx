import React, { useState } from 'react'
import type { Project } from '../types'
import { useNavigate } from 'react-router-dom'
import { EllipsisIcon, ImageIcon, Loader2, PlaySquareIcon, Share2Icon, Trash2Icon } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import api from '../configs/axios'
import toast from 'react-hot-toast'

const ProjectCard = ({ gen, setGenerations, forCommunity = false }: { gen: Project, setGenerations: React.Dispatch<React.SetStateAction<Project[]>>, forCommunity?: boolean }) => {

    const { getToken } = useAuth();

    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false);

    const productImage = gen.uploadedImages?.[0];
    const modelImage = gen.uploadedImages?.[1];

    const handleDelete = async (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this generation?");
        if (!confirm) return;

        try {
            const token = await getToken();
            const { data } = await api.delete(`/api/project/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setGenerations((generations) => generations.filter((gen) => gen.id !== id));
            toast.success(data.message || "Generation deleted successfully");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message || error.message);
            console.log(error);

        }
    }

    const togglePublish = async (projectId: string) => {
        try {
            const token = await getToken();
            const { data } = await api.get(`/api/user/publish/${projectId}`, { headers: { Authorization: `Bearer ${token}` } });
            setGenerations((generations)=> generations.map((gen)=> gen.id === projectId ? {...gen, isPublished: data.isPublished} : gen));
            toast.success(data.isPublished ? "Generation published successfully" : "Generation unpublished successfully");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message || error.message);
            console.log(error);

        }
    }

    return (
        <div key={gen.id} className='mb-4 break-inside-avoid'>
            <div className='bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition group'>
                {/* Preview */}
                <div className={`${gen?.aspectRatio === '9:16' ? 'aspect-9/16' : 'aspect-video'} relative w-full overflow-hidden`}>
                    {gen.generatedImage && (
                        <img src={gen.generatedImage} alt={gen.productName} className={`absolute inset-0 w-full h-full object-cover transition duration-500 ${gen.generatedVideo ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`} />
                    )}

                    {gen.generatedVideo && (
                        <video src={gen.generatedVideo} loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-100 transition duration-500" onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => e.currentTarget.pause()} />
                    )}

                    {(!gen?.generatedImage && !gen.generatedVideo) && (
                        <div>
                            <Loader2 className="size-7 animate-spin" />
                        </div>
                    )}

                    {/* Status badges */}
                    <div className="absolute left-3 top-3 flex gap-2 items-center">
                        {gen.isGenerating && (
                            <span className="text-xs px-2 py-1 bg-yellow-600/30 rounded-full">Generating</span>
                        )}

                        {gen.isPublished && (
                            <span className="text-xs px-2 py-1 bg-green-600/30 rounded-full">Published</span>
                        )}
                    </div>

                    {/* action menu for my generations only */}
                    {!forCommunity && (
                        <div
                            onMouseOverCapture={() => { setMenuOpen(true) }}
                            onMouseLeave={() => { setMenuOpen(false) }}
                            className="absolute right-3 top-3 sm:opacity-0 group-hover:opacity-100 transition flex items-center gap-2">
                            <div className="absolute right-3 top-3">
                                <EllipsisIcon className="ml-auto bg-black/10 rounded-full p-1 size-7" />
                            </div>
                            <div className="flex flex-col items-end w-32 text-sm">
                                <ul className={`text-xs ${menuOpen ? 'block' : 'hidden'} overflow-hidden right0 peer-focus:block hoverLblock w-40 bg-black/50 backdrop-blur text-white border border-gray-500/50 rounded-lg shadow-md mt-2 py-1 z-10`}>
                                    {
                                        gen.generatedImage && <a href="#" download className="flex gap-2 items-center px-4 py-2 hover:bg-black/10 cursor-pointer"><ImageIcon /> Download Image</a>
                                    }
                                    {
                                        gen.generatedVideo && <a href="#" download className="flex gap-2 items-center px-4 py-2 hover:bg-black/10 cursor-pointer"><PlaySquareIcon /> Download Video</a>
                                    }
                                    {
                                        (gen.generatedVideo || gen.generatedImage) && <button onClick={() => navigator.share({ url: gen.generatedVideo || gen.generatedImage, title: gen.productName, text: gen.productDescription })} className="w-full flex gap-2 items-center px-4 py-2 hover:bg-black/10 cursor-pointer">
                                            <Share2Icon /> Share
                                        </button>
                                    }
                                    <button onClick={() => handleDelete(gen.id)} className="w-full flex gap-2 items-center px-4 py-2 hover:bg-red-950/10 text-red-400 cursor-pointer">
                                        <Trash2Icon /> Delete
                                    </button>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Source Images */}
                    <div className="absolute right-3 bottom-3">
                        {productImage && (
                            <img id="img-product" src={productImage} alt="product" className="w-16 h-16 object-cover rounded-full animate-float" />
                        )}
                        {modelImage && (
                            <img id="img-model" src={modelImage} alt="model" className="w-16 h-16 object-cover rounded-full animate-float -ml-8" style={{ animationDelay: '3s' }} />
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="p-4">
                    {/* product name, date, aspect ratio */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="font-medium text-lg mb-1">{gen.productName}</h3>
                            <p className="text-sm text-gray-400">Created: {new Date(gen.createdAt).toLocaleDateString()}</p>
                            {gen.updatedAt && (
                                <p className="text-xs text-gray-500 mt-1">Updated: {new Date(gen.updatedAt).toLocaleDateString()}</p>
                            )}
                        </div>
                        <div className="text-right">
                            <div className="mt-2 flex flex-col items-end gap-1">
                                <span className="text-xs px-2 py-1 bg-white/5 rounded-full">Aspect: {gen.aspectRatio}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* product description */}
                {gen.productDescription && (
                    <div className="mt-3">
                        <p className="text-xs text-gray-400 mb-1 ml-2">Description</p>
                        <div className="text-sm text-gray-300 bg-white/3 p-2 rounded-md wrap-break-word">{gen.productDescription}</div>
                    </div>
                )}
                {/* user prompt */}
                {gen.userPrompt && (
                    <div className="mt-3">
                        <p className="text-xs text-gray-400 mb-1 ml-2">User Prompt</p>
                        <div className="text-sm text-gray-300 bg-white/3 p-2 rounded-md">{gen.userPrompt}</div>
                    </div>
                )}

                {/* buttons */}
                {!forCommunity && (
                    <div className="mt-4 grid grid-cols-2 gap-3 p-2">
                        <button onClick={() => { navigate(`/result/${gen.id}`); scrollTo(0, 0) }} className="text-xs justify-center border border-white  p-2 px-2 rounded-md hover:bg-transparent transition-colors flex items-center gap-2">
                            View Details
                        </button>
                        <button className="bg-indigo-700 p-2 px-2 rounded-md hover:bg-indigo-800 transition-colors flex items-center gap-2 justify-center text-xs" onClick={() => togglePublish(gen.id)}>
                            {gen.isPublished ? 'unpublish' : 'publish'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProjectCard
