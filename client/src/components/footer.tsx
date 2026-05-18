import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <>
            <footer className="px-6 md:px-16 lg:px-24 xl:px-32 border-t border-gray-800">
                <div className="border-x p-8 md:p-14 border-gray-800 grid gap-12 md:grid-cols-2">
                    <div>
                        <h1 className="text-4xl font-semibold">
                            Genify<span className="text-lg">.</span>
                            <span className="text-indigo-700">AI</span>
                        </h1>

                        <p className="mt-6 text-sm/7 max-w-sm text-gray-500">
                            Create viral UGC in seconds. Upload product images and a model photo — our AI instantly produces professional lifestyle imagery and short-form videos.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-urbanist text-lg/8 font-semibold">
                                <Link to="/" className="hover:underline">
                                    Home
                                </Link>
                            </h4>

                            <ul className="mt-3">
                                <li className="text-sm/7 text-gray-500">
                                    <Link to="/community" className="hover:underline">
                                        Community
                                    </Link>
                                </li>

                                <li className="text-sm/7 text-gray-500">
                                    <Link to="/generate" className="hover:underline">
                                        Generator
                                    </Link>
                                </li>

                                <li className="text-sm/7 text-gray-500">
                                    <Link to="/plans" className="hover:underline">
                                        Pricing
                                    </Link>
                                </li>

                                <li className="text-sm/7 text-gray-500">
                                    <Link to="/faq" className="hover:underline">
                                        FAQ
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-urbanist text-lg/8 font-semibold">
                                Legal
                            </h4>

                            <ul className="mt-3">
                                <li className="text-sm/7 text-gray-500">
                                    <Link to="/privacy-policy" className="hover:underline">
                                        Privacy Policy
                                    </Link>
                                </li>

                                <li className="text-sm/7 text-gray-500">
                                    <Link to="/terms-of-service" className="hover:underline">
                                        Terms of Service
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>

            <div className="border-t border-gray-800">
                <p className="text-gray-500 py-6 text-center">
                    Copyright {new Date().getFullYear()} &copy;

                    <Link to="/">
                        Genify.ai
                    </Link>{" "}

                    All Right Reserved.
                </p>
            </div>
        </>
    );
};