
import { Editor } from "@tiptap/react";

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

export interface Document {
  id: string;
  title: string;
  content: string;
  updated_at: string;
  created_at?: string;
  owner_id?: string;
  status?: string;
  meta?: DocumentMeta;
}

export interface DocumentMeta {
  template_id?: string;
  owner_id?: string;
  version?: number;
  category?: string;
  project_id?: string;
  isTemplate?: boolean;
  tags?: string[];
  [key: string]: any;
}

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
  onSave?: () => Promise<void>;
  content?: string;
  documentTitle?: string;
  onTitleChange?: (title: string) => Promise<void>;
  onLoadDocument?: (doc: Document) => void;
  initialContent?: string;
  templateId?: string;
  showRoleNavigation?: boolean;
  currentDocument?: Document | null;
  onTemplateChange?: (templateId: string) => void;
}

export type UserRole = "designer" | "editor" | "writer" | "admin" | null;

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

export interface Project {
  id: string;
  name: string;
  description?: string;
  documents: string[];
  createdAt: string;
  updatedAt?: string;
  folders?: Folder[];
  documentCount?: number;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  items: string[];
}

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
