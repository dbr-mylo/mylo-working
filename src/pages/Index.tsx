
import { useParams } from "react-router-dom";
import { EditorNav } from "@/components/editor-nav";
import { useAuth } from "@/contexts/AuthContext";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useDocument } from "@/hooks/document";
import { MobileEditor } from "@/components/MobileEditor";
import { DesktopEditor } from "@/components/DesktopEditor";
import { useEffect } from "react";
import { useAutoSave } from "@/hooks/document/useAutoSave";

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
    loadDocument,
    isLoading
  } = useDocument(documentId);

  // Enable auto-save functionality
  useAutoSave({
    content,
    initialContent,
    documentTitle,
    saveDocument
  });
  
  const isEditorEditable = true; // Always editable since we only have editor role
  
  // Add a console log to track content changes
  useEffect(() => {
    console.log("Current document content in Index:", content ? `Length: ${content.length}, Preview: ${content.substring(0, 50)}...` : "empty");
  }, [content]);
  
  // Create a Promise-returning wrapper for setDocumentTitle
  const handleTitleChange = async (title: string): Promise<void> => {
    setDocumentTitle(title);
    // Save immediately when title changes
    await saveDocument();
    return Promise.resolve();
  };
  
  // Log on initial render
  useEffect(() => {
    console.log("Index component rendered with documentId:", documentId);
    console.log("Initial content:", content ? `Length: ${content.length}` : "empty");
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-editor-bg flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading document...</div>
      </div>
    );
  }
  
  // Render layout based on device size
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
      
      <main className="animate-fade-in">
        {isMobile ? (
          <MobileEditor
            content={content}
            onContentChange={setContent}
            isEditorEditable={isEditorEditable}
            isDesignEditable={false}
          />
        ) : (
          <DesktopEditor
            content={content}
            onContentChange={setContent}
            isEditorEditable={isEditorEditable}
            isDesignEditable={false}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
