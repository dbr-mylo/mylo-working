
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Project } from "@/lib/types";
import { MOCK_PROJECTS } from "./types";

export function useProjectsState() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation, this would be an API call
        // For now, we're using mock data
        setTimeout(() => {
          setProjects(MOCK_PROJECTS);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch projects"));
        setIsLoading(false);
        toast.error("Failed to load projects");
      }
    };

    fetchProjects();
  }, []);

  // Select a project by ID
  const selectProject = (projectId: string | null) => {
    if (!projectId) {
      setSelectedProject(null);
      return;
    }
    
    const project = projects.find(p => p.id === projectId);
    setSelectedProject(project || null);
    
    // Update the query parameter in the URL
    const url = new URL(window.location.href);
    if (project) {
      url.searchParams.set('project', projectId);
    } else {
      url.searchParams.delete('project');
    }
    
    window.history.replaceState({}, '', url.toString());
  };

  return {
    projects,
    setProjects,
    selectedProject,
    setSelectedProject,
    isLoading,
    error,
    setError,
    selectProject
  };
}
