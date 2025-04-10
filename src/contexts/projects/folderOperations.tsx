
import { toast } from "sonner";
import { Project, Folder } from "@/lib/types";

export function createFolderOperations(
  projects: Project[],
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
  selectedProject: Project | null,
  setSelectedProject: React.Dispatch<React.SetStateAction<Project | null>>,
  setError: React.Dispatch<React.SetStateAction<Error | null>>
) {
  // Create a folder within a project
  const createFolder = async (projectId: string, name: string, parentFolderId?: string): Promise<boolean> => {
    try {
      const newFolder: Folder = {
        id: `folder-${Date.now()}`,
        name,
        parentId: parentFolderId || null,
        items: []
      };
      
      setProjects(prevProjects => 
        prevProjects.map(p => {
          if (p.id === projectId) {
            return { 
              ...p, 
              folders: [...(p.folders || []), newFolder],
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
            folders: [...(prev.folders || []), newFolder]
          };
        });
      }
      
      toast.success(`Folder "${name}" created`);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to create folder");
      setError(error);
      toast.error(error.message);
      return false;
    }
  };

  return { createFolder };
}
