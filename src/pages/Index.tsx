
import { useState } from "react";
import { EditorPanel } from "@/components/EditorPanel";
import { DesignPanel } from "@/components/DesignPanel";
import { EditorNav } from "@/components/EditorNav";
import { useAuth } from "@/contexts/AuthContext";
import { useWindowSize } from "@/hooks/useWindowSize";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [content, setContent] = useState("");
  const { role, user } = useAuth();
  const { width } = useWindowSize();
  const isMobile = width < 1281;
  
  return (
    <div className="min-h-screen bg-editor-bg">
      <EditorNav currentRole={role || "editor"} />
      
      {isMobile ? (
        // Mobile view with tabs
        <main className="animate-fade-in p-4">
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="design">Design Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="editor" className="mt-0">
              <EditorPanel 
                content={content}
                onContentChange={setContent}
                isEditable={role === "editor"}
              />
            </TabsContent>
            <TabsContent value="design" className="mt-0">
              <DesignPanel 
                content={content}
                isEditable={role === "designer"}
              />
            </TabsContent>
          </Tabs>
        </main>
      ) : (
        // Desktop view with side-by-side panels
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
      )}
    </div>
  );
};

export default Index;
