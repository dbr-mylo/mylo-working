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
  onSave?: () => void;
}
