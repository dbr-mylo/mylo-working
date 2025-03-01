
export interface DesignPanelProps {
  content: string;
  isEditable?: boolean;
}

export interface EditorPanelProps {
  content: string;
  onContentChange: (content: string) => void;
  isEditable?: boolean;
}

export interface EditorNavProps {
  currentRole: string;
  content?: string;
  documentTitle?: string;
  onTitleChange?: (title: string) => void;
  onSave?: () => void;
}

export type UserRole = 'editor' | 'designer' | 'admin';

export interface AuthState {
  user: any | null;
  role: UserRole | null;
  isLoading: boolean;
}
