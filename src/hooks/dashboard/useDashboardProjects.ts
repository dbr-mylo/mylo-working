
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Project, Document } from "@/lib/types";

export const useDashboardProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Load projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        // For now we'll use mock data - in Phase 3 this would be connected to backend
        const mockProjects: Project[] = [
          { id: '1', name: 'Personal Documents', documentCount: 5, createdAt: new Date().toISOString() },
          { id: '2', name: 'Work', documentCount: 8, createdAt: new Date().toISOString() },
          { id: '3', name: 'Templates', documentCount: 3, createdAt: new Date().toISOString() }
        ];
        
        setProjects(mockProjects);
        // If there are projects, select the first one by default
        if (mockProjects.length > 0) {
          setSelectedProjectId(mockProjects[0].id);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        toast.error('Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjects();
  }, [user]);
  
  const createProject = async (name: string) => {
    try {
      // Mock project creation - would be a backend call in Phase 3
      const newProject: Project = {
        id: Date.now().toString(), // temporary ID 
        name,
        documentCount: 0,
        createdAt: new Date().toISOString()
      };
      
      setProjects([...projects, newProject]);
      setSelectedProjectId(newProject.id);
      toast.success(`Project "${name}" created`);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    }
  };
  
  const deleteProject = async (projectId: string) => {
    try {
      // Mock project deletion - would be a backend call in Phase 3
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
      
      if (selectedProjectId === projectId) {
        setSelectedProjectId(updatedProjects.length > 0 ? updatedProjects[0].id : null);
      }
      
      toast.success('Project deleted');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };
  
  const openCreateProjectModal = () => {
    setIsProjectModalOpen(true);
  };
  
  const closeCreateProjectModal = () => {
    setIsProjectModalOpen(false);
  };
  
  return {
    projects,
    selectedProjectId,
    isProjectModalOpen,
    isLoading,
    setSelectedProjectId,
    createProject,
    deleteProject,
    openCreateProjectModal,
    closeCreateProjectModal
  };
};
