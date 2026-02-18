import { useEffect, useState } from 'react'
import type { Project } from '../types';
import { Loader2 } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import api from '../configs/axios';
import toast from 'react-hot-toast';

const Community = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [generations, setGenerations] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const token = await getToken();
      const { data } = await api.get('/api/project/published', { headers: { Authorization: `Bearer ${token}` } });
      setGenerations(data.projects);
      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error)
    }
  }

  useEffect(() => {
    if(user){
      fetchProjects();
    }else if(isLoaded && !user){
      navigate('/login');
    }
  }, [user])

  return loading ? (
    <div className='flex items-center justify-center min-h-screen'>
      <Loader2 className='size-7 animate-spin text-white' />
    </div>
  ) : (
    <div className='min-h-screen text-white p-6 md:p-12'>
      <div className='max-w-6xl mx-auto'>
        <header className='mb-12'>
          <h1 className='text-3xl md:text-4xl font-semibold mb-4'>Community</h1>
          <p className='text-gray-400 '>See what others are creating with UGC.ai</p>
        </header>
        {/* Project List */}
        <div className='columns-1 sm:columns-2 lg:columns-3 gap-4'>
          {generations?.map((project) => (
            <ProjectCard key={project.id} gen={project} setGenerations={setGenerations} forCommunity={true} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Community
