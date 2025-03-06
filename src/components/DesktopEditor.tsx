
import { EditorPanel } from "@/components/EditorPanel";
import { DesignPanel } from "@/components/DesignPanel";
import { ToolSidebar } from "@/components/sidebar/ToolSidebar";
import { ToolPanel } from "@/components/sidebar/ToolPanel";
import { useAuth } from "@/contexts/AuthContext";

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
  const { role } = useAuth();
  const isDesigner = role === "designer";

  return (
    <main className="flex min-h-[calc(100vh-4rem)] animate-fade-in">
      {isDesigner && (
        <ToolSidebar>
          <ToolPanel title="Typography Tools">
            <p className="text-sm text-gray-500">Typography settings and tools appear here.</p>
          </ToolPanel>
          <ToolPanel title="Design Templates">
            <p className="text-sm text-gray-500">Template selection appears here.</p>
          </ToolPanel>
          <ToolPanel title="Color Palette">
            <p className="text-sm text-gray-500">Color palette tools appear here.</p>
          </ToolPanel>
        </ToolSidebar>
      )}
      
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
