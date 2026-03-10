import { DollarSign, GalleryHorizontalEnd, MenuIcon, SparkleIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useClerk, useUser, UserButton, useAuth, } from "@clerk/clerk-react";
import api from "../configs/axios";
import toast from "react-hot-toast";

export const Navbar = () => {
    const { user } = useUser();
    const { openSignIn, openSignUp } = useClerk();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const [credits, setCredits] = useState(0);
    const { pathname } = useLocation();
    const { getToken } = useAuth();


    const links = [
        { name: "Home", href: "/" },
        { name: "Create", href: "/generate" },
        { name: "Community", href: "/community" },
        { name: "Plans", href: "/plans" },
    ];

    const getUserCredits = async () => {
        try {
            const token = await getToken()
            const { data } = await api.get('/api/user/credits', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setCredits(data.credits)
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message);
            console.log("Credits:", error.credits);
            console.log(error);
        }
    }

    useEffect(() => {
        if (user) {
            (async () => await getUserCredits())()
        }
    }, [user, pathname])


    return (
        <div className="sticky top-0 left-0 w-full h-16 z-50 bg-black flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-800">
            <Link to='/' onClick={() => scrollTo(0, 0)} className="flex items-center gap-2 z-50">
               <h1 className="text-4xl font-bold">UGC.<span className="text-indigo-700">AI</span></h1>
            </Link>
            <div className="absolute left-1/2 transform -translate-x-1/2 max-md:hidden">
                <ul className="flex items-center gap-8">
                    {links.map((link) => (
                        <li key={link.name} onClick={() => scrollTo(0, 0)}>
                            <Link to={link.href} className="hover:opacity-70 py-1 font-medium text-sm text-gray-300 transition hover:text-white">
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex items-center gap-4 z-50">
                {!user ? (
                    <div className="p-5">
                        <button onClick={() => openSignIn()} className="text-sm font-medium text-gray-300 hover:text-white transition max-sm:hidden px-4 py-2 border border-white/20 rounded-md hover:bg-white/10">
                            Sign in
                        </button>
                        <button onClick={() => openSignUp()} className="max-md:hidden bg-indigo-600 hover:bg-indigo-700 transition duration-300 text-white font-medium text-sm px-5 py-2 rounded-lg ml-2">
                            Get Started
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">

                        <button onClick={() => navigate('/plans')} className="text-sm text-gray-300 hover:text-white transition">
                            Credits: {credits}
                        </button>
                        <UserButton>
                            <UserButton.MenuItems>
                                <UserButton.Action onClick={() => navigate('/generate')} label="Generate" labelIcon={<SparkleIcon size={14} />} />
                            </UserButton.MenuItems>

                            <UserButton.MenuItems>
                                <UserButton.Action onClick={() => navigate('/my-generation')} label="My Generations" labelIcon={<GalleryHorizontalEnd size={14} />} />
                            </UserButton.MenuItems>

                            <UserButton.MenuItems>
                                <UserButton.Action onClick={() => navigate('/community')} label="Community" labelIcon={<GalleryHorizontalEnd size={14} />} />
                            </UserButton.MenuItems>

                            <UserButton.MenuItems>
                                <UserButton.Action onClick={() => navigate('/plans')} label="Plans" labelIcon={<DollarSign size={14} />} />
                            </UserButton.MenuItems>
                        </UserButton>

                    </div>

                )}
                {!user && <button className="md:hidden" onClick={() => { setIsOpen(false); openSignUp() }}>
                    <MenuIcon className="size-6" />
                </button>}

            </div>
            <div className={`flex flex-col items-center justify-center gap-6 text-lg fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {links.map((link) => (
                    <Link
                        onClick={() => scrollTo(0, 0)}
                        key={link.name}
                        to={link.href}
                    >
                        {link.name}
                    </Link>
                ))}
                <button onClick={() => setIsOpen(false)}>
                    <XIcon className="size-6" />
                </button>
            </div>
        </div>
    );
};