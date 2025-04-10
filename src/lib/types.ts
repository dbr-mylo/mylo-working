
import { Editor } from "@tiptap/react";

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
  title: string;
  content: string;
  created_at?: string;
  updated_at: string;
  owner_id?: string;
  status?: string;
  meta?: DocumentMeta;
  userId?: string;
  version?: number;
  isTemplate?: boolean;
  projectId?: string;
  folderId?: string;
}

export interface DocumentMeta {
  status?: string;
  tags?: string[];
  templateId?: string;
  templateVersion?: number;
  customFields?: Record<string, any>;
  project_id?: string;
  template_id?: string;
  owner_id?: string;
  version?: number;
  category?: string;
  isTemplate?: boolean;
  [key: string]: any;
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
  documentCount?: number;
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
  onTemplateChange?: (templateId: string) => void;
}

export interface DesignPanelProps {
  content: string;
  isEditable: boolean;
  templateId?: string;
}

export interface EditorPanelProps {
  content: string;
  onContentChange: (content: string) => void;
  isEditable: boolean;
  templateId?: string;
  editorInstance?: Editor | null;
}

// Template types
export interface Template {
  id: string;
  name: string;
  styles: string;
  owner_id?: string;
  status?: 'draft' | 'published';
  category?: string;
  version?: number;
  created_at?: string;
  updated_at?: string;
}

// Typography and styling
export interface TextStyle {
  id: string;
  name: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  lineHeight: string;
  letterSpacing: string;
  selector: string;
  description?: string;
  
  parentId?: string;
  isDefault?: boolean;
  isSystem?: boolean;
  isUsed?: boolean;
  created_at?: string;
  updated_at?: string;
  textAlign?: string;
  textTransform?: string;
  textDecoration?: string;
  marginTop?: string;
  marginBottom?: string;
  customProperties?: Record<string, string>;
}

export interface StyleFormData {
  name: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  lineHeight: string;
  letterSpacing: string;
  selector: string;
  description?: string;
  parentId?: string;
  textAlign?: string;
  textTransform?: string;
  textDecoration?: string;
  marginTop?: string;
  marginBottom?: string;
  customProperties?: Record<string, string>;
}

export interface StyleContextMenuProps {
  style: TextStyle;
  onEdit: (style: TextStyle) => void;
  onDelete: (id: string) => void;
  onDuplicate: (style: TextStyle) => void;
  position: { x: number, y: number } | null;
  onClose: () => void;
}

export interface TypographyStyles {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  lineHeight: string;
  letterSpacing: string;
  textAlign: string;
}

// Auth and application state
export interface AuthState {
  user: any | null;
  role: UserRole | null;
  isLoading: boolean;
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'offline';

export interface AutosaveState {
  status: SaveStatus;
  lastSaved: Date | null;
}

export interface DocumentVersion {
  content: string;
  timestamp: Date;
  title?: string;
  id?: string;
}
