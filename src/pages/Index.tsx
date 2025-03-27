
import React from "react";
import { useIndexSetup } from "@/hooks/useIndexSetup";
import { DocumentLayout } from "@/components/layout/DocumentLayout";
import { DesignerView } from "@/components/views/DesignerView";
import { WriterView } from "@/components/views/WriterView";
import { LoadingView } from "@/components/views/LoadingView";
import { StyleTestView } from "@/components/views/StyleTestView";

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
  
  // Render regular document layout with appropriate view
  return (
    <DocumentLayout
      role={role}
      content={content}
      documentTitle={documentTitle}
      onTitleChange={handleTitleChange}
      onSave={saveDocument}
      onLoadDocument={loadDocument}
      initialContent={initialContent}
      templateId={templateId}
      onTemplateChange={setTemplateId}
      editorInstance={editorInstance}
      isEditorEditable={isEditorEditable}
      isWriter={isWriter}
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
    </DocumentLayout>
  );
};

export default Index;
