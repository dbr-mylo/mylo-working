
import { toast } from "sonner";
import { Project } from "@/lib/types";

export function createDocumentOperations(
  projects: Project[],
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
  selectedProject: Project | null,
  setSelectedProject: React.Dispatch<React.SetStateAction<Project | null>>,
  setError: React.Dispatch<React.SetStateAction<Error | null>>
) {
  // Add a document to a project
  const addDocumentToProject = async (projectId: string, documentId: string): Promise<boolean> => {
    try {
      setProjects(prevProjects => 
        prevProjects.map(p => {
          if (p.id === projectId) {
            // Avoid duplicates
            if (!p.documents.includes(documentId)) {
              return { 
                ...p, 
                documents: [...p.documents, documentId],
                updatedAt: new Date().toISOString()
              };
            }
          }
          return p;
        })
      );
      
      // Update selected project if necessary
      if (selectedProject?.id === projectId) {
        setSelectedProject(prev => {
          if (!prev) return null;
          if (!prev.documents.includes(documentId)) {
            return {
              ...prev,
              documents: [...prev.documents, documentId]
            };
          }
          return prev;
        });
      }
      
      toast.success("Document added to project");
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to add document to project");
      setError(error);
      toast.error(error.message);
      return false;
    }
  };

  // Remove a document from a project
  const removeDocumentFromProject = async (projectId: string, documentId: string): Promise<boolean> => {
    try {
      setProjects(prevProjects => 
        prevProjects.map(p => {
          if (p.id === projectId) {
            return { 
              ...p, 
              documents: p.documents.filter(id => id !== documentId),
              updatedAt: new Date().toISOString(),
              // Also remove from folders
              folders: p.folders?.map(folder => ({
                ...folder,
                items: folder.items.filter(id => id !== documentId)
              }))
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
            documents: prev.documents.filter(id => id !== documentId),
            folders: prev.folders?.map(folder => ({
              ...folder,
              items: folder.items.filter(id => id !== documentId)
            }))
          };
        });
      }
      
      toast.success("Document removed from project");
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to remove document from project");
      setError(error);
      toast.error(error.message);
      return false;
    }
  };

  // Count documents in a project
  const documentCount = (projectId: string): number => {
    const project = projects.find(p => p.id === projectId);
    return project?.documents.length || 0;
  };

  return {
    addDocumentToProject,
    removeDocumentFromProject,
    documentCount
  };
}
