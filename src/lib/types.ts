
export type UserRole = "editor" | "designer";

export interface EditorPanelProps {
  content: string;
  onContentChange: (content: string) => void;
  isEditable: boolean;
}

export interface DesignPanelProps {
  content: string;
  isEditable: boolean;
}

export interface EditorNavProps {
  currentRole: UserRole;
}

export interface Profile {
  id: string;
  display_name: string | null;
}

export interface AuthState {
  user: Profile | null;
  role: UserRole | null;
  isLoading: boolean;
}
