
import { useState } from "react";
import { EditorPanel } from "@/components/EditorPanel";
import { DesignPanel } from "@/components/DesignPanel";
import { EditorNav } from "@/components/EditorNav";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [content, setContent] = useState("");
  const { role, user } = useAuth();
  
  return (
    <div className="min-h-screen bg-editor-bg">
      <EditorNav currentRole={role || "editor"} />
      <main className="flex min-h-[calc(100vh-4rem)] animate-fade-in">
        <EditorPanel 
          content={content}
          onContentChange={setContent}
          isEditable={role === "editor"}
        />
        <DesignPanel 
          content={content}
          isEditable={role === "designer"}
        />
      </main>
    </div>
  );
};

export default Index;
