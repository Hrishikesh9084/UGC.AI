import { useEffect, useState } from 'react'
import type { Project } from '../types';
import ProjectCard from '../components/ProjectCard';
import { Loader2 } from 'lucide-react';
import { useAuth, useUser } from '@clerk/clerk-react';
import api from '../configs/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const MyGenerations = () => {

    const { getToken } = useAuth();
    const { user, isLoaded } = useUser();
    const navigate = useNavigate();

    const [generations, setGenerations] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMyGenerations = async () => {
        try {
            const token = await getToken();
            const { data } = await api.get('/api/user/projects', { headers: { Authorization: `Bearer ${token}` } });
            setGenerations(data.projects);
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            toast.error(error?.response?.data?.message || error.message);
            console.log(error)
        }
    }

    useEffect(() => {
        if (user) {
            fetchMyGenerations()
        } else if (isLoaded && !user) {
            navigate('/')
        }
    }, [])

    return loading ? (
        <div className='flex items-center justify-center min-h-screen'>
            <Loader2 className='size-7 animate-spin text-white' />
        </div>
    ) : (
        <div className='min-h-screen text-white p-6 md:p-12'>
            <div className='max-w-6xl mx-auto'>
                <header className='mb-12'>
                    <h1 className='text-3xl md:text-4xl font-semibold mb-4'>My Generations</h1>
                    <p className='text-gray-400'>View and manage your AI-generated content</p>
                </header>
                {/* Generations List */}
                <div className='columns-1 sm:columns-2 lg:columns-3 gap-4'>
                    {generations?.map((gen) => (
                        <ProjectCard key={gen.id} gen={gen} setGenerations={setGenerations} />
                    ))}
                </div>
                {generations?.length === 0 && (
                    <div className='text-center py-20 bg-white/5 rounded-xl border border-white/10'>
                        <h3 className='text-xl font-medium mb-2'>No generations yet.</h3>
                        <p className='text-gray-400 mb-6'>Start creating stunning product photos today.</p>
                        <button className='px-6 py-3 bg-indigo-700 rounded-md hover:bg-indigo-800 transition-colors' onClick={() => window.location.href = '/generate'}>Create New Generation</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyGenerations
