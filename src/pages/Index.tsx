
import { useState, useEffect } from "react";
import { EditorPanel } from "@/components/EditorPanel";
import { DesignPanel } from "@/components/DesignPanel";
import { EditorNav } from "@/components/EditorNav";
import { useAuth } from "@/contexts/AuthContext";
import { useWindowSize } from "@/hooks/useWindowSize";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [content, setContent] = useState("");
  const { role, user } = useAuth();
  const { width } = useWindowSize();
  const { toast } = useToast();
  const isMobile = width < 1281;
  
  // Determine which panel is editable based on the user's role
  const isEditorEditable = role === "editor";
  const isDesignEditable = role === "designer";
  
  useEffect(() => {
    // Fetch the user's latest document when they log in
    const fetchUserDocument = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('content')
          .eq('owner_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1);
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0 && data[0].content) {
          setContent(data[0].content);
          toast({
            title: "Document loaded",
            description: "Your latest document has been loaded.",
          });
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        toast({
          title: "Error loading document",
          description: "There was a problem loading your document.",
          variant: "destructive",
        });
      }
    };
    
    fetchUserDocument();
  }, [user]);
  
  return (
    <div className="min-h-screen bg-editor-bg">
      <EditorNav 
        currentRole={role || "editor"} 
        content={content}
        onSave={() => {
          toast({
            title: "Document saved",
            description: "Your document has been saved successfully.",
          });
        }}
      />
      
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
                isEditable={isEditorEditable}
              />
            </TabsContent>
            <TabsContent value="design" className="mt-0">
              <DesignPanel 
                content={content}
                isEditable={isDesignEditable}
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
            isEditable={isEditorEditable}
          />
          <DesignPanel 
            content={content}
            isEditable={isDesignEditable}
          />
        </main>
      )}
    </div>
  );
};

export default Index;
