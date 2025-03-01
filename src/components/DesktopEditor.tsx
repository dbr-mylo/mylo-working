
import { EditorPanel } from "@/components/EditorPanel";
import { DesignPanel } from "@/components/DesignPanel";

type DesktopEditorProps = {
  content: string;
  onContentChange: (content: string) => void;
  isEditorEditable: boolean;
  isDesignEditable: boolean;
};

export const DesktopEditor = ({ 
  content, 
  onContentChange, 
  isEditorEditable, 
  isDesignEditable 
}: DesktopEditorProps) => {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] animate-fade-in">
      <EditorPanel 
        content={content}
        onContentChange={onContentChange}
        isEditable={isEditorEditable}
      />
      <DesignPanel 
        content={content}
        isEditable={isDesignEditable}
      />
    </main>
  );
};
