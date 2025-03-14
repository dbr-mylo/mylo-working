
import { useState } from "react";
import { EditorPanel } from "@/components/EditorPanel";
import { DesignPanel } from "@/components/DesignPanel";
import { Editor } from "@tiptap/react";
import "../styles/auth.css"; // Import auth styles for tabs

type MobileEditorProps = {
  content: string;
  onContentChange: (content: string) => void;
  isEditorEditable: boolean;
  isDesignEditable: boolean;
  templateId?: string;
  editorInstance?: Editor | null;
};

export const MobileEditor = ({ 
  content, 
  onContentChange, 
  isEditorEditable, 
  isDesignEditable,
  templateId,
  editorInstance
}: MobileEditorProps) => {
  const [activeTab, setActiveTab] = useState<"editor" | "design">("editor");

  return (
    <main className="animate-fade-in p-4">
      <div className="w-full">
        <div className="auth-tabs-list">
          <button 
            className="auth-tab-trigger" 
            data-state={activeTab === "editor" ? "active" : "inactive"}
            onClick={() => setActiveTab("editor")}
          >
            Editor
          </button>
          <button 
            className="auth-tab-trigger" 
            data-state={activeTab === "design" ? "active" : "inactive"}
            onClick={() => setActiveTab("design")}
          >
            Design Preview
          </button>
        </div>
        
        {activeTab === "editor" && (
          <div className="mt-2">
            <EditorPanel 
              content={content}
              onContentChange={onContentChange}
              isEditable={isEditorEditable}
              templateId={templateId}
              editorInstance={editorInstance}
            />
          </div>
        )}
        
        {activeTab === "design" && (
          <div className="mt-2">
            <DesignPanel 
              content={content}
              isEditable={isDesignEditable}
              templateId={templateId}
            />
          </div>
        )}
      </div>
    </main>
  );
};
