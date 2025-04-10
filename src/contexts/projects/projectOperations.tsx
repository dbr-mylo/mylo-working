
import { Project } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { handleError } from "@/utils/error/handleError";

export function createProjectOperations(
  projects: Project[],
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
  selectedProject: Project | null,
  setSelectedProject: React.Dispatch<React.SetStateAction<Project | null>>,
  setError: React.Dispatch<React.SetStateAction<Error | null>>
) {
  // Create a new project
  const createProject = async (name: string, description?: string): Promise<Project> => {
    try {
      // This would be an API call in a production environment
      const newProject: Project = {
        id: `project-${Date.now()}`,
        name,
        description,
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        documentCount: 0,
      };
      
      setProjects(prevProjects => [...prevProjects, newProject]);
      setSelectedProject(newProject);
      
      toast.success(`Project "${name}" created`);
      return newProject;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to create project");
      setError(error);
      handleError(error, "projectOperations.createProject");
      throw error;
    }
  };
  
  // Update an existing project
  const updateProject = async (projectId: string, data: Partial<Project>): Promise<boolean> => {
    try {
      // In a real implementation, this would be an API call
      setProjects(prevProjects => 
        prevProjects.map(p => {
          if (p.id === projectId) {
            return { 
              ...p, 
              ...data,
              updatedAt: new Date().toISOString()
            };
          }
          return p;
        })
      );
      
      // Update selected project if necessary
      if (selectedProject?.id === projectId) {
        setSelectedProject(prev => {
          if (!prev) return null;
          return {
            ...prev,
            ...data,
            updatedAt: new Date().toISOString()
          };
        });
      }
      
      toast.success(`Project updated`);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to update project");
      setError(error);
      handleError(error, "projectOperations.updateProject");
      throw error;
    }
  };
  
  // Delete a project
  const deleteProject = async (projectId: string): Promise<boolean> => {
    try {
      // In a real implementation, this would be an API call
      setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
      
      // Clear selected project if it's being deleted
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
      }
      
      toast.success("Project deleted");
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to delete project");
      setError(error);
      handleError(error, "projectOperations.deleteProject");
      throw error;
    }
  };
  
  return { createProject, updateProject, deleteProject };
}
