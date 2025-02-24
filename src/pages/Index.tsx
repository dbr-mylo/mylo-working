
import { useState } from "react";
import { EditorPanel } from "@/components/EditorPanel";
import { DesignPanel } from "@/components/DesignPanel";
import { EditorNav } from "@/components/EditorNav";
import { UserRole } from "@/lib/types";

const Index = () => {
  const [content, setContent] = useState("");
  const [currentRole] = useState<UserRole>("editor"); // In MVP, we'll hardcode the role
  
  return (
    <div className="min-h-screen bg-editor-bg">
      <EditorNav currentRole={currentRole} />
      <main className="flex min-h-[calc(100vh-4rem)] animate-fade-in">
        <EditorPanel 
          content={content}
          onContentChange={setContent}
          isEditable={currentRole === "editor"}
        />
        <DesignPanel 
          content={content}
          isEditable={currentRole === "designer"}
        />
      </main>
    </div>
  );
};

export default Index;
