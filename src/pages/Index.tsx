
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const [initialContent, setInitialContent] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const { role, user } = useAuth();
  const { width } = useWindowSize();
  const { toast } = useToast();
  const isMobile = width < 1281;
  const { documentId } = useParams();
  const navigate = useNavigate();
  
  const isEditorEditable = role === "editor";
  const isDesignEditable = role === "designer";
  
  useEffect(() => {
    if (documentId) {
      fetchDocument(documentId);
    } else {
      setContent("");
      setInitialContent("");
      setDocumentTitle("");
      setCurrentDocumentId(null);
    }
  }, [documentId, user]);

  const fetchDocument = async (id: string) => {
    try {
      if (user) {
        const { data, error } = await supabase
          .from('documents')
          .select('id, content, title, updated_at')
          .eq('id', id)
          .eq('owner_id', user.id)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            toast({
              title: "Document not found",
              description: "This document doesn't exist or you don't have access to it.",
              variant: "destructive",
            });
            navigate('/');
            return;
          }
          throw error;
        }
        
        if (data) {
          if (data.content) {
            setContent(data.content);
            setInitialContent(data.content);
          }
          if (data.title) {
            setDocumentTitle(data.title);
          }
          setCurrentDocumentId(data.id);
          
          toast({
            title: "Document loaded",
            description: "Your document has been loaded.",
          });
        }
      } else if (role) {
        try {
          const localDocs = localStorage.getItem('guestDocuments');
          if (localDocs) {
            const parsedDocs = JSON.parse(localDocs);
            const doc = parsedDocs.find((d: Document) => d.id === id);
            
            if (doc) {
              setContent(doc.content || "");
              setInitialContent(doc.content || "");
              setDocumentTitle(doc.title || "");
              setCurrentDocumentId(doc.id);
              
              toast({
                title: "Document loaded",
                description: "Your local document has been loaded.",
              });
            } else {
              toast({
                title: "Document not found",
                description: "This document doesn't exist in your local storage.",
                variant: "destructive",
              });
              navigate('/');
            }
          }
        } catch (error) {
          console.error("Error loading local document:", error);
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      toast({
        title: "Error loading document",
        description: "There was a problem loading your document.",
        variant: "destructive",
      });
      navigate('/');
    }
  };

  const handleSaveDocument = async () => {
    setInitialContent(content);
    console.log("Document saved successfully");
  };
  
  const handleLoadDocument = (doc: Document) => {
    setContent(doc.content);
    setInitialContent(doc.content);
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
        initialContent={initialContent}
      />
      
      {isMobile ? (
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

