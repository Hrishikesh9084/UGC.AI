import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import type { Project } from '../types'
import api from '../configs/axios'
import toast from 'react-hot-toast'
import ProjectCard from '../components/ProjectCard'

const SharedProject = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProject = async () => {
        try {
            const { data } = await api.get(`/api/project/published/${projectId}`);
            setProject(data.project);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message || 'Unable to load shared video');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (projectId) {
            fetchProject();
        } else {
            setLoading(false);
        }
    }, [projectId])

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <Loader2 className='size-7 animate-spin text-white' />
            </div>
        )
    }

    if (!project) {
        return (
            <div className='min-h-screen text-white p-6 md:p-12'>
                <div className='max-w-3xl mx-auto text-center border border-white/10 rounded-xl p-8 bg-white/5'>
                    <h1 className='text-2xl font-semibold mb-2'>Shared video not found</h1>
                    <p className='text-gray-400'>This shared link may be invalid or the project is no longer public.</p>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen text-white p-6 md:p-12'>
            <div className='max-w-3xl mx-auto'>
                <header className='mb-8'>
                    <h1 className='text-3xl md:text-4xl font-semibold mb-3'>Shared UGC Video</h1>
                    <p className='text-gray-400'>Check out this shared project.</p>
                </header>
                <ProjectCard gen={project} setGenerations={() => { }} forCommunity={true} />
            </div>
        </div>
    )
}

export default SharedProject
