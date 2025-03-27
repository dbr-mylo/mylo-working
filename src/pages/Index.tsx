
import React from "react";
import { useIndexSetup } from "@/hooks/useIndexSetup";
import { RoleAwareLayout } from "@/components/layout/RoleAwareLayout";
import { DesignerView } from "@/components/views/DesignerView";
import { WriterView } from "@/components/views/WriterView";
import { LoadingView } from "@/components/views/LoadingView";
import { StyleTestView } from "@/components/views/StyleTestView";
import { Document } from "@/lib/types";

const Index = () => {
  const {
    role,
    isStyleTestRoute,
    isLoading,
    content,
    setContent,
    initialContent,
    documentTitle,
    handleTitleChange,
    saveDocument,
    loadDocument,
    isDesigner,
    isWriter,
    isEditorEditable,
    isDesignEditable,
    templateId,
    setTemplateId,
    editorInstance
  } = useIndexSetup();
  
  if (isLoading && !isStyleTestRoute) {
    return <LoadingView />;
  }
  
  // Handle style test route
  if (isStyleTestRoute) {
    return (
      <StyleTestView 
        role={role} 
        handleTitleChange={handleTitleChange} 
        saveDocument={saveDocument} 
      />
    );
  }
  
  // Create a wrapper function to match the expected type
  const handleLoadDocument = (doc: Document) => {
    if (loadDocument) {
      loadDocument(doc);
    }
  };
  
  // Render regular document layout with appropriate view
  return (
    <RoleAwareLayout
      role={role}
      content={content}
      documentTitle={documentTitle}
      onTitleChange={handleTitleChange}
      onSave={saveDocument}
      onLoadDocument={handleLoadDocument}
      initialContent={initialContent}
      templateId={templateId}
    >
      {isDesigner ? (
        <DesignerView 
          content={content}
          isDesignEditable={isDesignEditable}
          templateId={templateId}
        />
      ) : (
        <WriterView
          content={content}
          onContentChange={setContent}
          isEditorEditable={isEditorEditable}
          isDesignEditable={isDesignEditable}
          templateId={templateId}
          editorInstance={editorInstance}
        />
      )}
    </RoleAwareLayout>
  );
};

export default Index;
