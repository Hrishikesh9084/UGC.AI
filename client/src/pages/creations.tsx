import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { SectionTitle } from '../components/section-title'

const Creations = () => {
    const [stopScroll, setStopScroll] = useState(false);
    const [mutedMap, setMutedMap] = useState<Record<number, boolean>>({});
    const cardData = [
        {
            title: "Valmiki Ramayan",
            video: "https://res.cloudinary.com/dibg7bjdz/video/upload/v1772671610/t7ga3hlpsci7ylt3z7g2.mp4",
        },
        {
            title: "Perplxity AI",
            video: "https://res.cloudinary.com/dibg7bjdz/video/upload/v1773460391/xut41mehvmm8mw98iwgi.mp4",
        },
        {
            title: "BMW S1000RR",
            video: "https://res.cloudinary.com/dibg7bjdz/video/upload/v1772596807/eylqabsgye3dssajjwrt.mp4",
        },
        {
            title: "Apple Vision Pro",
            video: "https://res.cloudinary.com/dibg7bjdz/video/upload/v1772671144/yx6vhujvwxtosh2hp9or.mp4",
        },
        {
            title: "Men With koenigsegg jesko",
            video: "https://res.cloudinary.com/dibg7bjdz/video/upload/v1773510381/o9g4ezcgefzyzelo9tma.mp4",
        },
    ];


    return (

        <div>

            <style>{`
                .marquee-inner {
                    animation: marqueeScroll linear infinite;
                }

                @keyframes marqueeScroll {
                    0% {
                        transform: translateX(0%);
                    }

                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>
            <div className="md:flex flex-col items-center mt-15 p-5">
                <SectionTitle title='Authentic UGC Ads with AI' description='Create content that looks like real customer posts shaky phone videos, natural lighting, imperfections, and authentic UGC-style ads.' />
                
                <div className="overflow-hidden w-full relative max-w-6xl mx-auto p-8 mt-7" onMouseEnter={() => setStopScroll(true)} onMouseLeave={() => setStopScroll(false)}>
                    <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-linear-to-r from-black to-transparent p-10" />
                    <div className="marquee-inner flex w-fit" style={{ animationPlayState: stopScroll ? "paused" : "running", animationDuration: cardData.length * 2500 + "ms" }}>
                        <div className="flex">
                            {[...cardData, ...cardData].map((card, index) => (
                                <div key={index} className="w-56 mx-4 h-80 relative group">
                                
                                    <video
                                        src={card.video}
                                        autoPlay
                                        muted={mutedMap[index] ?? true}
                                        loop
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setMutedMap((prev) => ({ ...prev, [index]: !(prev[index] ?? true) }))}
                                        className="absolute left-3 bottom-3 z-20 rounded-full bg-black/55 p-2 text-white hover:bg-black/75 transition"
                                        aria-label={(mutedMap[index] ?? true) ? 'Unmute video' : 'Mute video'}
                                        title={(mutedMap[index] ?? true) ? 'Unmute video' : 'Mute video'}
                                    >
                                        {(mutedMap[index] ?? true) ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                                    </button>
                                    <div className="flex items-center justify-center px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-0 backdrop-blur-md left-0 w-full h-full bg-black/20">
                                        <p className="text-white text-lg font-semibold text-center">{card.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-linear-to-l from-black to-transparent" />
                </div>
            </div>
            <hr className='text-gray-700' />
        </div>
    )
}

export default Creations
