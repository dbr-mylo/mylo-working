
import React, { createContext, useContext } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Project } from "@/lib/types";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";
import { ProjectsContextType } from "./projects/types";
import { useProjectsState } from "./projects/useProjectsState";
import { createProjectOperations } from "./projects/projectOperations";
import { createDocumentOperations } from "./projects/documentOperations";
import { createFolderOperations } from "./projects/folderOperations";

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

export const ProjectsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user, role } = useAuth();
  const { navigateTo } = useNavigationHandlers();
  
  // Get project state
  const {
    projects,
    setProjects,
    selectedProject,
    setSelectedProject,
    isLoading,
    error,
    setError,
    selectProject
  } = useProjectsState();

  // Get project operations
  const {
    createProject,
    updateProject,
    deleteProject
  } = createProjectOperations(projects, setProjects, selectedProject, setSelectedProject, setError);

  // Get document operations
  const {
    addDocumentToProject,
    removeDocumentFromProject,
    documentCount
  } = createDocumentOperations(projects, setProjects, selectedProject, setSelectedProject, setError);

  // Get folder operations
  const {
    createFolder
  } = createFolderOperations(projects, setProjects, selectedProject, setSelectedProject, setError);

  // Combine all operations into context value
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
