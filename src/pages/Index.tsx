
import { useParams } from "react-router-dom";
import { EditorNav } from "@/components/editor-nav";
import { useAuth } from "@/contexts/AuthContext";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useDocument } from "@/hooks/document";
import { MobileEditor } from "@/components/MobileEditor";
import { DesktopEditor } from "@/components/DesktopEditor";
import { DesignPanel } from "@/components/DesignPanel";
import { useEffect } from "react";
import { StyleApplicatorTest } from "@/components/design/typography/StyleApplicatorTest";
import { textStyleStore } from "@/stores/textStyles";

const Index = () => {
  const { documentId } = useParams();
  const { role } = useAuth();
  const { width } = useWindowSize();
  const isMobile = width < 1281;
  
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
    isLoading
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
          currentRole={role || "editor"} 
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
    if (role === "designer") {
      return (
        <DesignPanel 
          content={content}
          isEditable={isDesignEditable}
        />
      );
    } else {
      // For editor role, render the split view
      return isMobile ? (
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
      );
    }
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
      
      <main className="animate-fade-in">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
