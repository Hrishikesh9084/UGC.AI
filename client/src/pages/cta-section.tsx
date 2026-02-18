import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CtaSection() {
    return (
        <>
            <div className="max-w-4xl py-16 md:w-full mx-2 md:mx-auto flex flex-col items-center justify-center text-center bg-black rounded-2xl p-10 text-white mt-20">
                <h1 className="text-4xl md:text-4xl md:leading-15 font-medium max-w-2xl mt-5">
                    Ready to Transform Your Content?
                    <p className="text-sm mt-5">Join thousands of brands creating viral UGC with AI. No credit card required. Start creating now.</p>
                </h1>
                <p className="text-white text-sm mt-2">Unlock all our free resources instantly.</p>
                <Link to='/generate' className="flex gap-2 px-12 py-2.5 mt-6 rounded-full text-sm border bg-indigo-700 hover:bg-indigo-800 active:scale-95 transition-all text-white ">
                    Start Generating <ArrowRight className="size-6" />
                </Link>
            </div>
        </>
    );
};
