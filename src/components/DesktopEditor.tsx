
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
    <main className="flex h-[calc(100vh-4rem)] animate-fade-in">
      <div className="w-1/2">
        <EditorPanel 
          content={content}
          onContentChange={onContentChange}
          isEditable={isEditorEditable}
        />
      </div>
      <div className="w-1/2">
        <DesignPanel 
          content={content}
          isEditable={isDesignEditable}
        />
      </div>
    </main>
  );
};
