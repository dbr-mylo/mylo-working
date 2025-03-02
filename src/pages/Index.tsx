import { useParams, useNavigate } from "react-router-dom";
import { EditorNav } from "@/components/editor-nav";
import { useAuth } from "@/contexts/auth/AuthProvider";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useDocument } from "@/hooks/useDocument";
import { MobileEditor } from "@/components/MobileEditor";
import { DesktopEditor } from "@/components/DesktopEditor";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Index = () => {
  const { documentId } = useParams();
  const { role, signOut } = useAuth();
  const { width } = useWindowSize();
  const navigate = useNavigate();
  const isMobile = width < 1281;
  
  const {
    content,
    setContent,
    initialContent,
    documentTitle,
    setDocumentTitle,
    saveDocument,
    loadDocument,
    isLoading
  } = useDocument(documentId);
  
  const isEditorEditable = role === "editor";
  const isDesignEditable = role === "designer";
  
  useEffect(() => {
    console.log("Current document content in Index:", content ? `Length: ${content.length}, Preview: ${content.substring(0, 50)}...` : "empty");
  }, [content]);
  
  const handleTitleChange = async (title: string): Promise<void> => {
    setDocumentTitle(title);
    return Promise.resolve();
  };
  
  useEffect(() => {
    console.log("Index component rendered with documentId:", documentId);
    console.log("Initial content:", content ? `Length: ${content.length}` : "empty");
  }, []);
  
  const handleReturnToLogin = () => {
    if (role) {
      signOut();
    } else {
      navigate("/auth");
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-editor-bg flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading document...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-editor-bg flex flex-col">
      <EditorNav 
        currentRole={role || "editor"} 
        content={content}
        documentTitle={documentTitle}
        onTitleChange={handleTitleChange}
        onSave={saveDocument}
        onLoadDocument={loadDocument}
        initialContent={initialContent}
        onReturnToLogin={handleReturnToLogin}
      />
      
      {isMobile ? (
        <MobileEditor
          content={content}
          onContentChange={setContent}
          isEditorEditable={isEditorEditable}
          isDesignEditable={isDesignEditable}
        />
      ) : (
        <DesktopEditor
          content={content}
          onContentChange={setContent}
          isEditorEditable={isEditorEditable}
          isDesignEditable={isDesignEditable}
        />
      )}
    </div>
  );
};

export default Index;
