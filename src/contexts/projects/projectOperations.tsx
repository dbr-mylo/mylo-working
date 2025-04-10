
import { toast } from "sonner";
import { Project } from "@/lib/types";

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
      // In a real implementation, this would be an API call
      const newProject: Project = {
        id: `project-${Date.now()}`,
        name,
        description,
        documents: [],
        createdAt: new Date().toISOString(),
        documentCount: 0
      };
      
      // Add to the local state
      setProjects(prevProjects => [...prevProjects, newProject]);
      toast.success(`Project "${name}" created successfully`);
      
      return newProject;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to create project");
      setError(error);
      toast.error(`Failed to create project: ${error.message}`);
      throw error;
    }
  };

  // Update an existing project
  const updateProject = async (projectId: string, data: Partial<Project>): Promise<boolean> => {
    try {
      setProjects(prevProjects => 
        prevProjects.map(p => 
          p.id === projectId 
            ? { ...p, ...data, updatedAt: new Date().toISOString() } 
            : p
        )
      );
      
      // If we're updating the currently selected project, update that too
      if (selectedProject?.id === projectId) {
        setSelectedProject(prev => prev ? { ...prev, ...data } : null);
      }
      
      toast.success("Project updated");
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to update project");
      setError(error);
      toast.error(`Failed to update project: ${error.message}`);
      return false;
    }
  };

  // Delete a project
  const deleteProject = async (projectId: string): Promise<boolean> => {
    try {
      setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
      
      // If the deleted project was selected, clear the selection
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
      }
      
      toast.success("Project deleted");
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to delete project");
      setError(error);
      toast.error(`Failed to delete project: ${error.message}`);
      return false;
    }
  };

  return {
    createProject,
    updateProject,
    deleteProject
  };
}
