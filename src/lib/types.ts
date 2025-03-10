
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
  preferences?: TemplatePreferences | null;
}

export interface UseDocumentReturn {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  initialContent: string;
  documentTitle: string;
  setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
  currentDocumentId: string | null;
  isLoading: boolean;
  preferences: TemplatePreferences | null;
  setPreferences: React.Dispatch<React.SetStateAction<TemplatePreferences | null>>;
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
  
  // New fields for style management
  parentId?: string;           // For style inheritance
  isDefault?: boolean;         // To mark a default style
  isSystem?: boolean;          // To identify system styles that cannot be deleted
  isUsed?: boolean;            // To track if the style is used in any documents
  created_at?: string;         // Creation timestamp
  updated_at?: string;         // Last update timestamp
  textAlign?: string;          // Text alignment property
  textTransform?: string;      // For uppercase, lowercase, etc.
  textDecoration?: string;     // For underline, strikethrough, etc.
  marginTop?: string;          // Spacing above
  marginBottom?: string;       // Spacing below
  customProperties?: Record<string, string>; // For any additional CSS properties
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
  onSetDefault: (id: string) => void;
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

// Import the TemplatePreferences from the dedicated file to ensure consistency
import { TemplatePreferences } from "./types/preferences";
export { TemplatePreferences };
