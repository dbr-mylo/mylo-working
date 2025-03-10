export interface DesignPanelProps {
  content: string;
  isEditable: boolean;
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

export interface UseDocumentReturn {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  initialContent: string;
  documentTitle: string;
  setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
  currentDocumentId: string | null;
  isLoading: boolean;
  saveDocument: () => Promise<void>;
  loadDocument: (doc: Document) => void;
}

export interface EditorNavProps {
  currentRole: string;
  content?: string;
  documentTitle?: string;
  onTitleChange?: (title: string) => Promise<void>;
  onSave?: () => Promise<void>;
  onLoadDocument?: (doc: Document) => void;
  initialContent?: string;
}

export type UserRole = 'editor' | 'designer' | 'admin';

export interface AuthState {
  user: any | null;
  role: UserRole | null;
  isLoading: boolean;
}

export interface Template {
  id: string;
  name: string;
  styles: string;
  owner_id?: string;
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
  isPersistent?: boolean;
  textAlign?: string;
  textTransform?: string;
  textDecoration?: string;
  marginTop?: string;
  marginBottom?: string;
  customProperties?: Record<string, string>;
  created_at?: string;
  updated_at: string;
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
