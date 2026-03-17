import { ArrowDownRightIcon, ArrowRight, TrendingUpIcon, Volume2, VolumeX, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

export const HeroSection = () => {
    const navigate = useNavigate();
    const [isDemoOpen, setIsDemoOpen] = useState(false);
    const [isDemoMuted, setIsDemoMuted] = useState(true);

    return (
        <>
            <div className="flex flex-col max-md:px-2 items-center justify-center">
                <div className="mt-25 flex items-center justify-center gap-2">
                    <TrendingUpIcon className="size-5" />
                    Trusted by 50,000+ users worldwide
                </div>
                <h1 className="text-center font-urbanist text-[42px]/13 md:text-7xl/20 font-bold max-w-2xl bg-linear-to-r from-white to-white/50 bg-clip-text text-transparent">
                    Create viral UGC <br/><span className="text-indigo-700">in seconds </span> 
                </h1>
                <p className="text-center text-base text-zinc-300 max-w-lg mt-4">
                    Upload product images and a model photo — our AI instantly produces professional lifestyle imagery and short-form videos optimized for commercials & Reels.
                </p>
                <div className="mt-8 flex items-center justify-center gap-4">
                    <button className="bg-indigo-700 border border-gray-600 md:text-sm text-zinc-300 px-4 py-2.5 rounded-lg hover:bg-indigo-800" onClick={() => navigate('/generate')}>
                        Starting Generating
                        <ArrowRight className="ml-1 size-5 inline-flex " />
                    </button>
                    <button className="border border-gray-600 text-zinc-300 px-4 py-2.5 rounded-lg hover:bg-gray-900" onClick={() => setIsDemoOpen(true)}>
                        Watch Demo
                        <ArrowDownRightIcon className="ml-1 size-5 inline-flex" />
                    </button>
                </div>
            </div>
            <div className="p-10">
                
            </div>

            {isDemoOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
                    onClick={() => setIsDemoOpen(false)}
                >
                    <div
                        className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                            onClick={() => setIsDemoOpen(false)}
                            aria-label="Close demo popup"
                        >
                            <X className="size-5" />
                        </button>

                        <button
                            type="button"
                            className="absolute left-3 bottom-3 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                            onClick={() => setIsDemoMuted((prev) => !prev)}
                            aria-label={isDemoMuted ? 'Unmute video' : 'Mute video'}
                            title={isDemoMuted ? 'Unmute video' : 'Mute video'}
                        >
                            {isDemoMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                        </button>

                        <video
                            src={assets.demoVideo}
                            muted={isDemoMuted}
                            autoPlay
                            loop
                            
                            className="aspect-video w-full bg-black"
                        />
                    </div>
                </div>
            )}
        </>
    );
};