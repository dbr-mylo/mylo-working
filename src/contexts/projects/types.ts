
import { Project, Folder } from "@/lib/types";

export interface ProjectsContextType {
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

// Mock data for development
export const MOCK_PROJECTS: Project[] = [
  {
    id: "project-1",
    name: "Marketing Documents",
    description: "All marketing related documents",
    documents: ["doc-1", "doc-2"],
    createdAt: new Date().toISOString(),
    folders: [
      { id: "folder-1", name: "Campaigns", parentId: null, items: ["doc-1"] }
    ],
    documentCount: 2
  },
  {
    id: "project-2",
    name: "Legal Templates",
    description: "Legal document templates",
    documents: ["doc-3"],
    createdAt: new Date().toISOString(),
    folders: [],
    documentCount: 1
  },
  {
    id: "project-3",
    name: "Personal Documents",
    documents: [],
    createdAt: new Date().toISOString(),
    documentCount: 0
  }
];
