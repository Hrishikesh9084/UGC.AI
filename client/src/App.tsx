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
// import BlobCursor from "./components/BlobCursor";

export default function App() {
    return (
        <>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 50 }}>
                {/* <BlobCursor
                    blobType="circle"
                    fillColor="#5227FF"
                    trailCount={3}
                    sizes={[60, 125, 75]}
                    innerSizes={[20, 35, 25]}
                    innerColor="rgba(255,255,255,0.8)"
                    opacities={[0.6, 0.6, 0.6]}
                    shadowColor="rgba(0,0,0,0.75)"
                    shadowBlur={5}
                    shadowOffsetX={10}
                    shadowOffsetY={10}
                    filterStdDeviation={30}
                    useFilter={true}
                    fastDuration={0.1}
                    slowDuration={0.5}
                    zIndex={100}
                /> */}
            </div>
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