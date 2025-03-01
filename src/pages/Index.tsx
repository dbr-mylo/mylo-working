
import { useState, useEffect } from "react";
import { EditorPanel } from "@/components/EditorPanel";
import { DesignPanel } from "@/components/DesignPanel";
import { EditorNav } from "@/components/EditorNav";
import { useAuth } from "@/contexts/AuthContext";
import { useWindowSize } from "@/hooks/useWindowSize";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Document } from "@/lib/types";

const Index = () => {
  const [content, setContent] = useState("");
  const [documentTitle, setDocumentTitle] = useState("Untitled Document");
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
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
      if (user) {
        // Logged in user - fetch from Supabase
        try {
          const { data, error } = await supabase
            .from('documents')
            .select('id, content, title, updated_at')
            .eq('owner_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(1);
          
          if (error) {
            throw error;
          }
          
          if (data && data.length > 0) {
            if (data[0].content) {
              setContent(data[0].content);
            }
            if (data[0].title) {
              setDocumentTitle(data[0].title);
            }
            if (data[0].id) {
              setCurrentDocumentId(data[0].id);
            }
            
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
      } else if (role) {
        // Guest user with a role - try to load from localStorage
        try {
          const savedDocument = localStorage.getItem('guestDocument');
          if (savedDocument) {
            const parsedDoc = JSON.parse(savedDocument);
            if (parsedDoc.content) {
              setContent(parsedDoc.content);
            }
            if (parsedDoc.title) {
              setDocumentTitle(parsedDoc.title);
            }
            toast({
              title: "Document loaded",
              description: "Your local document has been loaded.",
            });
          }
        } catch (error) {
          console.error("Error loading local document:", error);
        }
      }
    };
    
    fetchUserDocument();
  }, [user, role]);

  const handleSaveDocument = () => {
    console.log("Document saved successfully");
  };
  
  const handleLoadDocument = (doc: Document) => {
    setContent(doc.content);
    setDocumentTitle(doc.title);
    setCurrentDocumentId(doc.id);
  };
  
  return (
    <div className="min-h-screen bg-editor-bg">
      <EditorNav 
        currentRole={role || "editor"} 
        content={content}
        documentTitle={documentTitle}
        onTitleChange={setDocumentTitle}
        onSave={handleSaveDocument}
        onLoadDocument={handleLoadDocument}
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
