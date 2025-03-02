
export interface DesignPanelProps {
  content: string;
  isEditable?: boolean;
}

export interface EditorPanelProps {
  content: string;
  onContentChange: (content: string) => void;
  isEditable?: boolean;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  updated_at: string;
}

export interface SaveDocumentResult {
  success: boolean;
  documentId?: string;
}

export interface UseDocumentReturn {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  initialContent: string;
  documentTitle: string;
  setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
  currentDocumentId: string | null;
  isLoading: boolean;
  saveDocument: () => Promise<SaveDocumentResult>;
  loadDocument: (doc: Document) => void;
}

export interface EditorNavProps {
  currentRole: string;
  content?: string;
  documentTitle?: string;
  onTitleChange?: (title: string) => Promise<void>;
  onSave?: () => Promise<SaveDocumentResult>;
  onLoadDocument?: (doc: Document) => void;
  initialContent?: string;
}

export type UserRole = 'editor' | 'designer' | 'admin';

export interface AuthState {
  user: any | null;
  role: UserRole | null;
  isLoading: boolean;
}
