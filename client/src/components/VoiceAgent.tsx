import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { LockKeyhole, LucideClockArrowDown, MousePointerSquareDashedIcon, Workflow } from 'lucide-react';

const PREMADE_VOICES = [
    { name: 'HuggingFace LJSpeech - Female (High Quality)', voiceURI: 'hf_ljspeech', group: 'HuggingFace' },
    { name: 'HuggingFace Bark - Expressive (High Quality)', voiceURI: 'hf_vctk', group: 'HuggingFace' },
    { name: 'Basic English - Free (Unlimited)', voiceURI: 'en', group: 'Basic' },
    { name: 'Basic US English - Free (Unlimited)', voiceURI: 'en-US', group: 'Basic' },
    { name: 'Basic UK English - Free (Unlimited)', voiceURI: 'en-GB', group: 'Basic' },
];

interface Agent {
    id: string;
    name: string;
    description: string;
    voiceURI: string;
    pitch: number;
    rate: number;
}

const VoiceAgentContent = () => {
    const { userId } = useAuth();
    const [agents, setAgents] = useState<Agent[]>([]);
    const [view, setView] = useState<'list' | 'form'>('list');
    const [editingId, setEditingId] = useState<string | null>(null);

    const [selectedVoice, setSelectedVoice] = useState<string>(PREMADE_VOICES[0].voiceURI);
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [pitch, setPitch] = useState<number>(1);
    const [rate, setRate] = useState<number>(1);
    const [testText, setTestText] = useState<string>('Hello! This is how I sound.');
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isLoadingAgents, setIsLoadingAgents] = useState<boolean>(false);
    
    // Voice Cloning State
    const [voiceType, setVoiceType] = useState<'premade' | 'clone'>('premade');
    const [audioFile, setAudioFile] = useState<File | null>(null);

    const fetchAgents = async () => {
        if (!userId) return;
        setIsLoadingAgents(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/voice-agent/list?userId=${userId}`);
            if (res.data.success) {
                setAgents(res.data.agents);
            }
        } catch (error) {
            console.error("Failed to fetch agents:", error);
            toast.error("Failed to load your voice agents.");
        } finally {
            setIsLoadingAgents(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, [userId]);

    const handleTestVoice = async () => {
        if (!testText) return;
        setIsPlaying(true);
        try {
            const response = await axios.post('http://localhost:5000/api/voice-agent/generate-speech', {
                text: testText,
                voiceURI: selectedVoice,
                pitch,
                rate
            });

            if (response.data.success && response.data.audioContent) {
                const audioUrl = `data:audio/mp3;base64,${response.data.audioContent}`;
                const audio = new Audio(audioUrl);
                audio.play();
                audio.onended = () => setIsPlaying(false);
            } else {
                toast.error("Failed to generate test audio.");
                setIsPlaying(false);
            }
        } catch (error) {
            console.error("Error generating speech:", error);
            toast.error("Failed to play test voice. Check backend configuration.");
            setIsPlaying(false);
        }
    };

    const handleSaveAgent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) { toast.error("You must be logged in."); return; }
        if (!name) { toast.error("Please provide a name."); return; }

        setIsSaving(true);
        try {
            let finalVoiceURI = selectedVoice;

            if (voiceType === 'clone') {
                if (!audioFile) {
                    toast.error("Please provide an audio sample to clone.");
                    setIsSaving(false);
                    return;
                }

                toast.loading("Cloning custom voice...", { id: "cloningToast" });
                const formData = new FormData();
                formData.append('name', name);
                formData.append('audio', audioFile);
                if (description) formData.append('description', description);

                const cloneRes = await axios.post('http://localhost:5000/api/voice-agent/clone-voice', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (cloneRes.data.success) {
                    finalVoiceURI = cloneRes.data.voiceId;
                    toast.success("Voice cloned successfully!", { id: "cloningToast" });
                } else {
                    toast.error("Failed to clone voice.", { id: "cloningToast" });
                    setIsSaving(false);
                    return;
                }
            }

            const payload = { name, description, voiceURI: finalVoiceURI, pitch, rate, userId };
            
            if (editingId) {
                await axios.put(`http://localhost:5000/api/voice-agent/${editingId}`, payload);
                toast.success("Voice agent updated!");
            } else {
                await axios.post('http://localhost:5000/api/voice-agent/create', payload);
                toast.success("Voice agent created!");
            }
            
            fetchAgents();
            setView('list');
            resetForm();
        } catch (error) {
            console.error("Error saving voice agent:", error);
            toast.error("An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this agent?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/voice-agent/${id}?userId=${userId}`);
            toast.success("Agent deleted.");
            fetchAgents();
        } catch (error) {
            console.error("Error deleting agent:", error);
            toast.error("Failed to delete agent.");
        }
    };

    const editAgent = (agent: Agent) => {
        setEditingId(agent.id);
        setName(agent.name);
        setDescription(agent.description);
        setSelectedVoice(agent.voiceURI);
        setPitch(agent.pitch);
        setRate(agent.rate);
        setView('form');
    };

    const resetForm = () => {
        setEditingId(null);
        setName('');
        setDescription('');
        setSelectedVoice(PREMADE_VOICES[0].voiceURI);
        setPitch(1);
        setRate(1);
        setVoiceType('premade');
        setAudioFile(null);
    };

    if (view === 'list') {
        return (
            <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-white">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">My Voice Agents</h2>
                        <p className="text-gray-400">Manage your custom text-to-speech voice profiles.</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setView('form'); }}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
                    >
                        + Create New Agent
                    </button>
                </div>

                {isLoadingAgents ? (
                    <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div></div>
                ) : agents.length === 0 ? (
                    <div className="bg-gray-800/20 border border-gray-700 rounded-3xl p-12 text-center">
                        <div className="text-6xl mb-4">🎤</div>
                        <h3 className="text-xl font-medium text-white mb-2">No Voice Agents Yet</h3>
                        <p className="text-gray-400 mb-6">Create your first custom voice agent to start generating high-quality AI narration.</p>
                        <button onClick={() => { resetForm(); setView('form'); }} className="px-6 py-2 border border-indigo-500 text-indigo-400 rounded-lg hover:bg-indigo-500/10">Create Agent</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {agents.map(agent => (
                            <div key={agent.id} className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6 hover:border-indigo-500/50 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-white">{agent.name}</h3>
                                    <div className="flex gap-2">
                                        <button onClick={() => editAgent(agent)} className="text-gray-400 hover:text-white p-1" title="Edit">✏️</button>
                                        <button onClick={() => handleDelete(agent.id)} className="text-gray-400 hover:text-red-400 p-1" title="Delete">🗑️</button>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">{agent.description || 'No description provided.'}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="text-xs px-2 py-1 bg-indigo-900/50 text-indigo-300 rounded-full border border-indigo-500/20">
                                        {PREMADE_VOICES.find(v => v.voiceURI === agent.voiceURI)?.name || 'Custom Voice'}
                                    </span>
                                    <span className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full border border-gray-700">Pitch: {agent.pitch.toFixed(1)}x</span>
                                    <span className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full border border-gray-700">Rate: {agent.rate.toFixed(1)}x</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-white">
            <button onClick={() => setView('list')} className="mb-6 text-gray-400 hover:text-white flex items-center gap-2">
                ← Back to Dashboard
            </button>
            <div className="text-white rounded-3xl shadow-sm border border-dashed border-purple-500 overflow-hidden">
                <div className="px-6 py-8 sm:p-10">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">{editingId ? 'Edit Voice Agent' : 'Create Your Voice Agent'}</h2>
                        <p className="text-lg text-gray-400">Design a custom, professional voice assistant for your content.</p>
                    </div>

                    <form onSubmit={handleSaveAgent} className="space-y-8">
                        {/* Agent Details */}
                        <div className=" p-6 rounded-2xl space-y-5 border border-dashed border-purple-500">
                            <h3 className="text-lg font-semibold mb-2">Agent Details</h3>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Agent Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                   className='w-full bg-white/3 rounded-lg border-2 border-white/50 focus:border-white p-4 text-sm outline-none resize-none'
                                    placeholder="e.g., Professor Smith"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description <span className="text-gray-500 font-normal">(Optional)</span></label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className='w-full bg-white/3 rounded-lg border-2 border-white/50 focus:border-white p-4 text-sm outline-none resize-none'
                                    placeholder="What does this agent teach?"
                                />
                            </div>
                        </div>

                        {/* Voice Settings */}
                        <div className="p-6 rounded-2xl space-y-5 border border-dashed border-purple-500">
                            <h3 className="text-lg font-semibold mb-2 text-white">Voice Configuration</h3>
                            
                            {!editingId && (
                                <div className="flex bg-gray-800 p-1 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setVoiceType('premade')}
                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${voiceType === 'premade' ? 'border border-white text-white shadow-sm' : 'text-gray-400 hover:text-white '}`}
                                    >
                                        Premade Voices
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setVoiceType('clone')}
                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${voiceType === 'clone' ? 'border border-white text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        <span className="text-yellow-400">✨</span> Clone Custom Voice
                                    </button>
                                </div>
                            )}

                            {voiceType === 'premade' || editingId ? (
                                <div>
                                    <label htmlFor="voice" className="block text-sm font-medium text-gray-300 mb-1">Select Voice Style</label>
                                    <select
                                        id="voice"
                                        value={selectedVoice}
                                        onChange={(e) => setSelectedVoice(e.target.value)}
                                        className="block w-full bg-gray-800 border border-gray-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                                        disabled={editingId ? !PREMADE_VOICES.find(v => v.voiceURI === selectedVoice) : false}
                                    >
                                        {PREMADE_VOICES.map((voice) => (
                                            <option key={voice.voiceURI} value={voice.voiceURI}>
                                                {voice.name}
                                            </option>
                                        ))}
                                        {editingId && !PREMADE_VOICES.find(v => v.voiceURI === selectedVoice) && (
                                            <option value={selectedVoice}>Custom Cloned Voice</option>
                                        )}
                                    </select>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-indigo-500 transition-colors">
                                    <input 
                                        type="file" 
                                        accept="audio/*" 
                                        id="audioUpload" 
                                        className="hidden" 
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setAudioFile(e.target.files[0]);
                                            }
                                        }}
                                    />
                                    <label htmlFor="audioUpload" className="cursor-pointer block">
                                        <div className="text-4xl mb-3">🎙️</div>
                                        <div className="text-lg font-medium text-white mb-1">Upload Audio Sample</div>
                                        <p className="text-sm text-gray-400 mb-4">Provide a clear audio recording without background noise (1-5 mins for best results). Requires ElevenLabs API Key in backend.</p>
                                        
                                        {audioFile ? (
                                            <div className="inline-flex items-center gap-2 bg-indigo-900/50 text-indigo-200 px-4 py-2 rounded-lg border border-indigo-500/30">
                                                <span>🎵</span> {audioFile.name}
                                                <button type="button" onClick={(e) => { e.preventDefault(); setAudioFile(null); }} className="ml-2 hover:text-white">✕</button>
                                            </div>
                                        ) : (
                                            <span className="inline-block px-4 py-2 px-10 py-3 rounded-md disabled:opacity-70 disabled:cursor-not-allowed flex border bg-indigo-700 focus:bg-indigo-800 hover:bg-indigo-800 active:scale-95 transition-all text-white items-center">
                                                Browse Files
                                            </span>
                                        )}
                                    </label>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="/50 border border-gray-600 p-4 rounded-xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <label htmlFor="pitch" className="block text-sm font-medium text-gray-300">Pitch</label>
                                        <span className="text-xs font-semibold text-indigo-300 bg-indigo-900/50 px-2 py-1 rounded-full">{pitch.toFixed(1)}x</span>
                                    </div>
                                    <input
                                        type="range"
                                        id="pitch"
                                        min="0.5"
                                        max="2"
                                        step="0.1"
                                        value={pitch}
                                        onChange={(e) => setPitch(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                </div>

                                <div className="/50 border border-gray-600 p-4 rounded-xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <label htmlFor="rate" className="block text-sm font-medium text-gray-300">Speed</label>
                                        <span className="text-xs font-semibold text-indigo-300 bg-indigo-900/50 px-2 py-1 rounded-full">{rate.toFixed(1)}x</span>
                                    </div>
                                    <input
                                        type="range"
                                        id="rate"
                                        min="0.5"
                                        max="2"
                                        step="0.1"
                                        value={rate}
                                        onChange={(e) => setRate(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Testing Area */}
                        <div className="p-6 rounded-2xl space-y-5 border border-dashed border-purple-500">
                            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                🎤 Test Your Agent's Voice
                            </h3>
                            
                            <div>
                                <textarea
                                    value={testText}
                                    onChange={(e) => setTestText(e.target.value)}
                                    rows={2}
                                    className='w-full bg-white/3 rounded-lg border-2 border-white/50 focus:border-white p-4 text-sm outline-none resize-none'
                                    placeholder="Type something to hear how it sounds..."
                                />
                            </div>
                            
                            <button
                                type="button"
                                onClick={handleTestVoice}
                                disabled={isPlaying}
                               className='px-10 py-3 rounded-md disabled:opacity-70 disabled:cursor-not-allowed flex border bg-indigo-700 focus:bg-indigo-800 hover:bg-indigo-800 active:scale-95 transition-all text-white items-center'
                            >
                                {isPlaying ? 'Playing...' : 'Play Audio'}
                            </button>
                        </div>

                        <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-end border-t border-gray-700">
                            <button
                                type="button"
                                onClick={() => setView('list')}
                                className="inline-flex items-center justify-center px-6 py-3 border border-gray-600 text-base font-medium rounded-xl text-gray-300 hover: focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className='px-10 py-3 rounded-md disabled:opacity-70 disabled:cursor-not-allowed flex border bg-indigo-700 focus:bg-indigo-800 hover:bg-indigo-800 active:scale-95 transition-all text-white items-center'
                            >
                                {isSaving ? 'Saving...' : (editingId ? 'Update Agent' : 'Create Agent')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const VoiceAgent = () => {
    return (
        <div className="relative isolate min-h-[80vh] w-full">
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900/40 backdrop-blur-md rounded-2xl">
                <div className="text-6xl mb-4"><LockKeyhole /></div>
                <h2 className="text-3xl font-bold text-white mb-2">Under Development</h2>
                <p className="text-gray-300 max-w-md text-center">This feature is currently locked. We will notify you when it goes live!</p>
            </div>
            <div className="pointer-events-none select-none blur-sm opacity-50">
                <VoiceAgentContent />
            </div>
        </div>
    );
};

export default VoiceAgent;