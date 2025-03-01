
import { useParams } from "react-router-dom";
import { EditorNav } from "@/components/EditorNav";
import { useAuth } from "@/contexts/AuthContext";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useDocument } from "@/hooks/useDocument";
import { MobileEditor } from "@/components/MobileEditor";
import { DesktopEditor } from "@/components/DesktopEditor";

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
  
  return (
    <div className="min-h-screen bg-editor-bg">
      <EditorNav 
        currentRole={role || "editor"} 
        content={content}
        documentTitle={documentTitle}
        onTitleChange={setDocumentTitle}
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
