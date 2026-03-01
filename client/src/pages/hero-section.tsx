import { ArrowDownRightIcon, ArrowRight, TrendingUpIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
    const navigate = useNavigate();
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
                    <button className="border border-gray-600 text-zinc-300 px-4 py-2.5 rounded-lg hover:bg-gray-900">
                        Watch Demo
                        <ArrowDownRightIcon className="ml-1 size-5 inline-flex" />
                    </button>
                </div>
            </div>
            <div className="p-10">
                
            </div>
        </>
    );
};