
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Project, Document } from "@/lib/types";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";

interface ProjectsContextType {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: Error | null;
  selectProject: (projectId: string | null) => void;
  createProject: (name: string, description?: string) => Promise<Project>;
  updateProject: (projectId: string, data: Partial<Project>) => Promise<boolean>;
  deleteProject: (projectId: string) => Promise<boolean>;
  addDocumentToProject: (projectId: string, documentId: string) => Promise<boolean>;
  removeDocumentFromProject: (projectId: string, documentId: string) => Promise<boolean>;
  createFolder: (projectId: string, name: string, parentFolderId?: string) => Promise<boolean>;
  documentCount: (projectId: string) => number;
}

// Create context with a default value
const ProjectsContext = createContext<ProjectsContextType>({
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,
  selectProject: () => {},
  createProject: async () => ({ id: "", name: "", documents: [], createdAt: "" }),
  updateProject: async () => false,
  deleteProject: async () => false,
  addDocumentToProject: async () => false,
  removeDocumentFromProject: async () => false,
  createFolder: async () => false,
  documentCount: () => 0
});

// Mock data for development
const MOCK_PROJECTS: Project[] = [
  {
    id: "project-1",
    name: "Marketing Documents",
    description: "All marketing related documents",
    documents: ["doc-1", "doc-2"],
    createdAt: new Date().toISOString(),
    folders: [
      { id: "folder-1", name: "Campaigns", parentId: null, 
        items: ["doc-1"] }
    ]
  },
  {
    id: "project-2",
    name: "Legal Templates",
    description: "Legal document templates",
    documents: ["doc-3"],
    createdAt: new Date().toISOString(),
    folders: []
  },
  {
    id: "project-3",
    name: "Personal Documents",
    documents: [],
    createdAt: new Date().toISOString()
  }
];

export const ProjectsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user, role } = useAuth();
  const { navigateTo } = useNavigationHandlers();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch projects when user or role changes
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
  }, [user?.id, role]);

  // Select a project by ID
  const selectProject = (projectId: string | null) => {
    if (!projectId) {
      setSelectedProject(null);
      return;
    }
    
    const project = projects.find(p => p.id === projectId);
    setSelectedProject(project || null);
    
    // Update the query parameter in the URL
    // This is a simple approach - could be enhanced with a proper router
    const url = new URL(window.location.href);
    if (project) {
      url.searchParams.set('project', projectId);
    } else {
      url.searchParams.delete('project');
    }
    
    window.history.replaceState({}, '', url.toString());
  };

  // Create a new project
  const createProject = async (name: string, description?: string): Promise<Project> => {
    try {
      // In a real implementation, this would be an API call
      const newProject: Project = {
        id: `project-${Date.now()}`,
        name,
        description,
        documents: [],
        createdAt: new Date().toISOString()
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

  // Create a folder within a project
  const createFolder = async (projectId: string, name: string, parentFolderId?: string): Promise<boolean> => {
    try {
      const newFolder = {
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

  // Count documents in a project
  const documentCount = (projectId: string): number => {
    const project = projects.find(p => p.id === projectId);
    return project?.documents.length || 0;
  };

  const value = {
    projects,
    selectedProject,
    isLoading,
    error,
    selectProject,
    createProject,
    updateProject,
    deleteProject,
    addDocumentToProject,
    removeDocumentFromProject,
    createFolder,
    documentCount
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};

// Custom hook to use the projects context
export const useProjects = () => useContext(ProjectsContext);
