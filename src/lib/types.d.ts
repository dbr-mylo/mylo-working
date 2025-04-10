
// Adding the Folder interface that was missing

// User types
export type UserRole = "admin" | "designer" | "editor" | "writer" | null;

export interface User {
  id: string;
  email?: string;
  name?: string;
  role?: UserRole;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: string;
  fontSize?: string;
  viewMode?: string;
}

// Document types
export interface Document {
  id: string;
  title?: string;
  content?: string;
  userId?: string;
  created_at?: string;
  updated_at?: string;
  isTemplate?: boolean; 
  version?: number;
  meta?: DocumentMeta;
  projectId?: string; // Reference to the project it belongs to
  folderId?: string;  // Reference to the folder within a project
}

export interface DocumentMeta {
  status?: string;
  tags?: string[];
  templateId?: string;
  templateVersion?: number;
  customFields?: Record<string, any>;
  project_id?: string;
}

// Project and folder organization
export interface Project {
  id: string;
  name: string;
  description?: string;
  documents: string[]; // Array of document IDs
  createdAt: string;
  updatedAt?: string;
  folders?: Folder[]; // Nested folders within the project
  documentCount?: number; // For backwards compatibility with existing code
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null; // null if it's a root folder
  items: string[]; // Document IDs in this folder
}

// Search and filtering
export interface SearchQuery {
  term: string;
  filters?: SearchFilters;
  sort?: SortOption;
}

export interface SearchFilters {
  dateRange?: DateRange;
  documentType?: 'document' | 'template' | 'all';
  status?: string[];
  tags?: string[];
  projectId?: string;
  folderId?: string;
}

export interface DateRange {
  from: string;
  to: string;
}

export interface SortOption {
  field: 'title' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}

// Editor types
export interface UseDocumentReturn {
  content: string;
  setContent: (content: string) => void;
  initialContent: string;
  documentTitle: string;
  setDocumentTitle: (title: string) => void;
  currentDocumentId: string | null;
  isLoading: boolean;
  saveDocument: () => Promise<void>;
  loadDocument: (doc: Document) => void;
  documentMeta?: DocumentMeta;
}

export interface EditorNavProps {
  currentRole: string;
  content?: string;
  documentTitle?: string;
  onTitleChange?: (title: string) => Promise<void>;
  onSave?: () => Promise<void>;
  onLoadDocument?: (doc: Document) => void;
  initialContent?: string;
  templateId?: string;
  showRoleNavigation?: boolean;
  currentDocument?: Document | null;
}
