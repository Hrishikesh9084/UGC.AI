import { Routes, Route } from "react-router-dom";
import LenisScroll from "./components/lenis";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import Home from "./pages/Home";
import Generator from "./pages/Generator";
import MyGenerations from "./pages/MyGenerations";
import Community from "./pages/Community";
import Loading from "./pages/Loading";
import Result from "./pages/Result";
import Plans from "./pages/Plans";
import { Toaster } from "react-hot-toast";

export default function App() {
    return (
        <>
            <Toaster toastOptions={{ style: { background: '#333', color: '#fff' } }} />
            <Navbar />
            <LenisScroll />
            <main className="mx-4 md:mx-16 lg:mx-24 xl:mx-32 border-x border-gray-800">
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/generate' element={<Generator />} />
                    <Route path='/result/:projectId' element={<Result />} />
                    <Route path='/my-generation' element={<MyGenerations />} />
                    <Route path='/community' element={<Community />} />
                    <Route path='/plans' element={<Plans />} />
                    <Route path='/loading' element={<Loading />} />
                </Routes>
            </main>
            <Footer />
        </>
    )
}