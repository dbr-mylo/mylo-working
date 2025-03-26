
import { useParams } from "react-router-dom";
import { EditorNav } from "@/components/editor-nav";
import { useAuth } from "@/contexts/AuthContext";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useDocument } from "@/hooks/document";
import { MobileEditor } from "@/components/MobileEditor";
import { DesktopEditor } from "@/components/DesktopEditor";
import { DesignPanel } from "@/components/DesignPanel";
import { useEffect, useState } from "react";
import { StyleApplicatorTest } from "@/components/design/typography/StyleApplicatorTest";
import { textStyleStore } from "@/stores/textStyles";
import { Editor } from "@tiptap/react";
import { EditorToolbarContainer } from "@/components/EditorToolbarContainer";
import { useEditorSetup } from "@/components/rich-text/useEditor";
import { useIsDesigner, useIsWriter } from "@/utils/roles";

const Index = () => {
  const { documentId } = useParams();
  const { role } = useAuth();
  const { width } = useWindowSize();
  const isMobile = width < 1281;
  
  // Use role hooks
  const isDesigner = useIsDesigner();
  const isWriter = useIsWriter();
  
  // State for template ID and shared editor instance
  const [templateId, setTemplateId] = useState<string | undefined>(undefined);
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
  
  // Check if this is the style test route
  const isStyleTestRoute = documentId === "style-test";
  
  const {
    content,
    setContent,
    initialContent,
    documentTitle,
    setDocumentTitle,
    saveDocument,
    loadDocument,
    isLoading,
    documentMeta
  } = useDocument(documentId);
  
  // When document metadata is loaded, extract template ID
  useEffect(() => {
    if (documentMeta && documentMeta.template_id) {
      setTemplateId(documentMeta.template_id);
    }
  }, [documentMeta]);
  
  const isEditorEditable = isWriter;
  const isDesignEditable = isDesigner;
  
  // Initialize editor setup for the shared toolbar
  const editorSetup = useEditorSetup({
    content: content || '',
    onContentChange: setContent,
    isEditable: isEditorEditable
  });
  
  // Store the editor instance for sharing
  useEffect(() => {
    if (editorSetup.editor) {
      setEditorInstance(editorSetup.editor);
    }
  }, [editorSetup.editor]);
  
  // Add a console log to track content changes
  useEffect(() => {
    console.log("Current document content in Index:", content ? `Length: ${content.length}, Preview: ${content.substring(0, 50)}...` : "empty");
  }, [content]);
  
  // Create a Promise-returning wrapper for setDocumentTitle
  const handleTitleChange = async (title: string): Promise<void> => {
    setDocumentTitle(title);
    return Promise.resolve();
  };
  
  // Clear editor cache on component mount to reset problematic styles
  useEffect(() => {
    // Clear styles caches on component mount - more thorough approach
    try {
      console.log("Performing initial cache cleanup");
      // Standard cleanup
      textStyleStore.clearDefaultResetStyle();
      textStyleStore.clearEditorCache();
      
      // Get localStorage size estimate
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key) || '';
          totalSize += (key.length + value.length) * 2; // Unicode chars are 2 bytes
        }
      }
      console.log(`Current localStorage size estimate: ${totalSize / 1024} KB`);
      
      // Deep clean if localStorage is getting large or we have many items
      if (totalSize > 100000 || localStorage.length > 10) {
        console.log("Performing deep clean due to large localStorage size");
        textStyleStore.deepCleanStorage();
      }
      
      console.log("Index component rendered with documentId:", documentId);
      console.log("Initial content:", content ? `Length: ${content.length}` : "empty");
    } catch (error) {
      console.error("Error clearing cache on mount:", error);
    }
  }, []);
  
  if (isLoading && !isStyleTestRoute) {
    return (
      <div className="min-h-screen bg-editor-bg flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading document...</div>
      </div>
    );
  }
  
  // Handle style test route
  if (isStyleTestRoute) {
    return (
      <div className="min-h-screen bg-editor-bg">
        <EditorNav 
          currentRole={role || "writer"} 
          documentTitle="Style Inheritance Test"
          onTitleChange={handleTitleChange}
          onSave={saveDocument}
        />
        <main className="animate-fade-in">
          <StyleApplicatorTest />
        </main>
      </div>
    );
  }
  
  // Render different layouts based on user role
  const renderContent = () => {
    if (isDesigner) {
      return (
        <DesignPanel 
          content={content}
          isEditable={isDesignEditable}
        />
      );
    } else {
      // For writer role, render the split view
      return isMobile ? (
        <MobileEditor
          content={content}
          onContentChange={setContent}
          isEditorEditable={isEditorEditable}
          isDesignEditable={isDesignEditable}
          templateId={templateId}
          editorInstance={editorInstance}
        />
      ) : (
        <DesktopEditor
          content={content}
          onContentChange={setContent}
          isEditorEditable={isEditorEditable}
          isDesignEditable={isDesignEditable}
          templateId={templateId}
          editorInstance={editorInstance}
        />
      );
    }
  };
  
  return (
    <div className="min-h-screen bg-editor-bg">
      <EditorNav 
        currentRole={role || "writer"} 
        content={content}
        documentTitle={documentTitle}
        onTitleChange={handleTitleChange}
        onSave={saveDocument}
        onLoadDocument={loadDocument}
        initialContent={initialContent}
        templateId={templateId}
        onTemplateChange={setTemplateId}
      />
      
      {/* Add the toolbar container below the nav when in writer mode */}
      {isWriter && (
        <EditorToolbarContainer 
          editor={editorInstance} 
          isEditable={isEditorEditable}
        />
      )}
      
      <main className="animate-fade-in">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
