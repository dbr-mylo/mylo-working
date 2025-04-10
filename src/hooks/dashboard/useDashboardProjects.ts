
import { useState, useEffect } from 'react';
import { Project } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const useDashboardProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulating API call
    setIsLoading(true);
    setTimeout(() => {
      // Mock data
      const mockProjects: Project[] = [
        {
          id: 'project-1',
          name: 'Marketing Campaign',
          documentCount: 5,
          createdAt: new Date().toISOString(),
          documents: [], // Initialize with empty array
        },
        {
          id: 'project-2',
          name: 'Product Launch',
          documentCount: 3,
          createdAt: new Date().toISOString(),
          documents: [], // Initialize with empty array
        },
        {
          id: 'project-3',
          name: 'Research Documents',
          documentCount: 7,
          createdAt: new Date().toISOString(),
          documents: [], // Initialize with empty array
        }
      ];
      
      setProjects(mockProjects);
      setIsLoading(false);
    }, 1000);
  }, []);

  const createProject = async (name: string, description?: string) => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name,
      description,
      documentCount: 0,
      createdAt: new Date().toISOString(),
      documents: [], // Initialize with empty array
    };

    setProjects(prev => [...prev, newProject]);
    setSelectedProject(newProject);
    
    toast({
      title: 'Project created',
      description: `${name} has been created successfully`,
    });
    
    return newProject;
  };

  const selectProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId) || null;
    setSelectedProject(project);
  };

  return {
    projects,
    selectedProject,
    isLoading,
    createProject,
    selectProject,
  };
};
