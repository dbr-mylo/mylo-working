
import { useParams } from "react-router-dom";
import { EditorNav } from "@/components/editor-nav";
import { useAuth } from "@/contexts/AuthContext";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useDocument } from "@/hooks/useDocument";
import { MobileEditor } from "@/components/MobileEditor";
import { DesktopEditor } from "@/components/DesktopEditor";
import { useEffect } from "react";

const Index = () => {
  const { documentId } = useParams();
  const { role } = useAuth();
  const { width } = useWindowSize();
  const isMobile = width < 1281;
  
  const {
    content,
    setContent,
    initialContent,
    documentTitle,
    setDocumentTitle,
    saveDocument,
    loadDocument
  } = useDocument(documentId);
  
  const isEditorEditable = role === "editor";
  const isDesignEditable = role === "designer";
  
  // Add a console log to track content changes
  useEffect(() => {
    console.log("Current document content in Index:", content ? `Length: ${content.length}, Preview: ${content.substring(0, 50)}...` : "empty");
  }, [content]);
  
  // Create a Promise-returning wrapper for setDocumentTitle
  const handleTitleChange = async (title: string): Promise<void> => {
    setDocumentTitle(title);
    return Promise.resolve();
  };
  
  return (
    <div className="min-h-screen bg-editor-bg">
      <EditorNav 
        currentRole={role || "editor"} 
        content={content}
        documentTitle={documentTitle}
        onTitleChange={handleTitleChange}
        onSave={saveDocument}
        onLoadDocument={loadDocument}
        initialContent={initialContent}
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
