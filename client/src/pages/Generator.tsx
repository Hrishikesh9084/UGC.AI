import { useEffect } from "react";
import { useState } from "react"
import { SectionTitle } from "../components/section-title"
import UploadZone from "../components/UploadZone"
import { Loader2, RectangleHorizontalIcon, RectangleVerticalIcon, WandSparkles } from "lucide-react"
import { useAuth, useUser } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import api from "../configs/axios"
import axios from "axios"

interface VoiceAgent {
    id: string;
    name: string;
    voiceURI: string;
    pitch: number;
    rate: number;
}

const Generator = () => {

    const { user } = useUser();
    const { getToken, userId } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('')
    const [productName, setProductName] = useState('')
    const [ProductDescription, setProductDescription] = useState('')
    const [aspectRatio, setAspectRatio] = useState('9:16')
    const [productImage, setProductImage] = useState<File | null>(null)
    const [modelImage, setModelImage] = useState<File | null>(null)
    const [userPrompt, setUserPrompt] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)

    // Voice Agent State
    const [voiceAgents, setVoiceAgents] = useState<VoiceAgent[]>([]);
    const [selectedAgentId, setSelectedAgentId] = useState<string>('');
    const [voiceScript, setVoiceScript] = useState<string>('');
    const [generatedAudio, setGeneratedAudio] = useState<string>('');
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

    useEffect(() => {
        const fetchAgents = async () => {
            if (!userId) return;
            try {
                const res = await axios.get(`http://localhost:5000/api/voice-agent/list?userId=${userId}`);
                if (res.data.success) {
                    setVoiceAgents(res.data.agents);
                }
            } catch (error) {
                console.error("Failed to fetch agents:", error);
            }
        };
        fetchAgents();
    }, [userId]);

    const handleGenerateAudioPreview = async () => {
        if (!selectedAgentId || !voiceScript) {
            toast.error("Please select a voice agent and enter a script.");
            return;
        }

        const agent = voiceAgents.find(a => a.id === selectedAgentId);
        if (!agent) return;

        setIsGeneratingAudio(true);
        try {
            const response = await axios.post('http://localhost:5000/api/voice-agent/generate-speech', {
                text: voiceScript,
                voiceURI: agent.voiceURI,
                pitch: agent.pitch,
                rate: agent.rate
            });

            if (response.data.success && response.data.audioContent) {
                const audioUrl = `data:audio/mp3;base64,${response.data.audioContent}`;
                setGeneratedAudio(audioUrl);
                toast.success("Audio generated successfully!");
            } else {
                toast.error("Failed to generate audio.");
            }
        } catch (error: any) {
            console.error("Error generating speech:", error);
            if (error.response?.status === 402) {
                toast.error("ElevenLabs credit limit reached. Please use a free basic voice.");
            } else {
                toast.error("Failed to generate audio.");
            }
        } finally {
            setIsGeneratingAudio(false);
        }
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'model') => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'product') setProductImage(e.target.files[0])
            else setModelImage(e.target.files[0])
        }
    }

    const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!user) return toast("Please login to generate")
        if (!productImage || !modelImage || !name || !productName || !aspectRatio)
            return toast("Please fill all the required fields")

        try {
            setIsGenerating(true);
            const formData = new FormData();

            formData.append('name', name);
            formData.append('productName', productName);
            formData.append('productDescription', ProductDescription);
            formData.append('userPrompt', userPrompt);
            formData.append('aspectRatio', aspectRatio);
            formData.append('images', productImage);
            formData.append('images', modelImage);
            if (generatedAudio) {
                formData.append('generatedAudio', generatedAudio);
            }

            const token = await getToken();
            const { data } = await api.post('/api/project/create', formData, {
                headers: { Authorization: `Bearer ${token}` }
            })

            toast.success(data.message);
            navigate('/result/' + data.projectId);
            console.log(data)

        } catch (error: any) {
            setIsGenerating(false);
            toast.error(error?.response?.data?.message || error.message);
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen text-white p-6 md:p-12">

            <form onSubmit={handleGenerate} className="max-w-4xl mx-auto mb-40">
                <div className="md:mb-12 mb-6 flex flex-col items-center">
                    <SectionTitle title="Create In-Context Image" description="Upload your model and product images to generate stunning UGC, short-form videos and social media posts" />
                </div>
                <div className="flex gap-20 max-sm:flex-col items-start justify-between">
                    {/* Left Col */}
                    <div className="flex flex-col w-full sm:max-w-60 gap-8 mt-8">
                        {/* Product Image */}
                        <UploadZone label="Product Image" file={productImage} onClear={() => setProductImage(null)} onChange={(e) => handleFileChange(e, 'product')} />

                        {/* <p>Model Image</p> */}
                        <UploadZone label="Model Image" file={modelImage} onClear={() => setModelImage(null)} onChange={(e) => handleFileChange(e, 'model')} />
                    </div>
                    {/* Right Col */}
                    <div className='w-full'>
                        <div className='mb-4'>
                            <label htmlFor="name" className='block text-sm mb-4'>Project Name</label>
                            <input type="text" id='name' value={name} onChange={(e) => setName(e.target.value)} placeholder='Name your project' required className='w-full bg-white/3 rounded-lg border-2 p-4 text-sm border-white/50 outline-none transition-all focus:border-white' />
                        </div>

                        <div className='mb-4 text-gray-300'>
                            <label htmlFor="productName" className='block text-sm mb-4'>Product Name</label>
                            <input type="text" id='productName' value={productName} onChange={(e) => setProductName(e.target.value)} placeholder='Enter name of the product' required className='w-full bg-white/3 rounded-lg border-2 p-4 text-sm border-white/50 outline-none transition-all focus:border-white' />
                        </div>

                        {/* Product Description */}

                        <div className='mb-4 text-gray-300'>
                            <label htmlFor="productDescription" className='block text-sm mb-4'>Product Description <span className='text-xs text-white/40'>(optional)</span></label>

                            <textarea id='productDescription' rows={4} value={ProductDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder='Enter the description of the product' className='w-full bg-white/3 rounded-lg border-2 border-white/50 focus:border-white p-4 text-sm outline-none resize-none' />

                        </div>

                        {/* Aspect Ratio */}
                        <div className='mb-4 text-gray-300'>
                            <label className='block text-sm mb-4'>Aspect Ratio</label>
                            <div className='flex gap-3'>
                                <RectangleVerticalIcon onClick={() => setAspectRatio('9:16')} className={`p-2.5 size-13 bg-white/6 rounded transition-all ring-2 ring-transparent cursor-pointer ${aspectRatio === '9:16' ? 'ring-white/50 bg-white' : ''} `} />
                                <RectangleHorizontalIcon onClick={() => setAspectRatio('16:9')} className={`p-2.5 size-13 bg-white/6 rounded transition-all ring-2 ring-transparent cursor-pointer ${aspectRatio === '16:9' ? 'ring-white/50 bg-white' : ''} `} />
                            </div>


                        </div>
                        {/* user Prompt */}
                        <div className='mb-4 text-gray-300'>
                            <label htmlFor="userPrompt" className='block text-sm mb-4'>Image Generation Prompt <span className='text-xs text-indigo-600'>(optional)</span></label>

                            <textarea id='userPrompt' rows={4} value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)} placeholder='Describe how you want the image to look.' className='w-full bg-white/3 rounded-lg border-2 border-white/50 focus:border-white p-4 text-sm outline-none resize-none' />
                        </div>

                        {/* Voice Agent Selection */}
                        <div className='mb-4 p-5 border border-white rounded'>
                            <h3 className="text-lg font-semibold text-indigo-300 mb-4 flex items-center gap-2">🎤 Voice Narration (Optional)</h3>
                            
                            <label htmlFor="agentSelect" className='block text-sm mb-2 text-gray-300'>Select Voice Agent</label>
                            <select 
                                id="agentSelect" 
                                value={selectedAgentId} 
                                onChange={(e) => setSelectedAgentId(e.target.value)}
                                className='w-full  bg-white/3 rounded-lg border-2 border-white/50 focus:border-white p-4 text-sm outline-none resize-none'
                            >
                                <option value="">-- No Voice Narration --</option>
                                {voiceAgents.map(agent => (
                                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                                ))}
                            </select>

                            {selectedAgentId && (
                                <>
                                    <label htmlFor="voiceScript" className='block text-sm mb-2 text-gray-300'>Narration Script</label>
                                    <textarea 
                                        id='voiceScript' 
                                        rows={3} 
                                        value={voiceScript} 
                                        onChange={(e) => setVoiceScript(e.target.value)} 
                                        placeholder='Enter the script for your voice agent to read...' 
                                        className='w-full bg-white/3 rounded-lg border-2 border-white/50 focus:border-white p-4  text-sm outline-none resize-none mb-3' 
                                    />
                                    
                                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                                        <button 
                                            type="button" 
                                            onClick={handleGenerateAudioPreview} 
                                            disabled={isGeneratingAudio || !voiceScript}
                                            className='px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50 w-full sm:w-auto'
                                        >
                                            {isGeneratingAudio ? 'Generating...' : 'Generate Audio Preview'}
                                        </button>
                                        
                                        {generatedAudio && (
                                            <audio src={generatedAudio} controls className="h-10 w-full sm:max-w-[200px]" />
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className='flex justify-center mt-10'>
                    <button disabled={isGenerating} className='px-10 py-3 rounded-md disabled:opacity-70 disabled:cursor-not-allowed flex border bg-indigo-700 focus:bg-indigo-800 hover:bg-indigo-800 active:scale-95 transition-all text-white items-center'>
                        {isGenerating ? (
                            <>
                                Generating... <Loader2 className='ml-2 size-5 animate-spin' />

                            </>
                        ) : (
                            <>
                                Generate Image <WandSparkles className='ml-2 size-5 mr-2' />
                            </>
                        )}
                    </button>
                </div>
            </form>

        </div>
    )
}

export default Generator
