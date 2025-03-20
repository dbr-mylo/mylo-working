
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DocumentStyles } from "./preview/DocumentStyles";
import { EditableContent } from "./preview/EditableContent";
import { ViewableContent } from "./preview/ViewableContent";
import { EmptyContent } from "./preview/EmptyContent";
import { SelectedElementBar } from "./preview/SelectedElementBar";
import { useDocumentPreview } from "./preview/useDocumentPreview";
import { Editor } from "@tiptap/react";
import { useDocumentId } from "./preview/useDocumentId";
import { useTemplateLoader } from "./preview/useTemplateLoader";
import { extractDimensionsFromCSS } from "@/utils/templateUtils";
import { textStyleStore } from "@/stores/textStyles";

interface DocumentPreviewProps {
  content: string;
  customStyles: string;
  isEditable: boolean;
  onContentChange?: (content: string) => void;
  onElementSelect?: (element: HTMLElement | null) => void;
  renderToolbarOutside?: boolean;
  externalToolbar?: boolean;
  editorInstance?: Editor | null;
  templateId?: string;
}

export const DocumentPreview = ({ 
  content, 
  customStyles, 
  isEditable, 
  onContentChange = () => {},
  onElementSelect = () => {},
  renderToolbarOutside = false,
  externalToolbar = false,
  editorInstance = null,
  templateId = ''
}: DocumentPreviewProps) => {
  const { role } = useAuth();
  const isDesigner = role === "designer";
  const isEditor = role === "editor";
  
  const documentId = useDocumentId();
  
  const { 
    templateStyles, 
    templateName, 
    templateVersion,
    isTemplateLoading
  } = useTemplateLoader({
    templateId,
    customStyles,
    documentId
  });
  
  const {
    previewRef,
    selectedElement,
    handlePreviewClick,
    handleApplyStyle
  } = useDocumentPreview(onElementSelect);
  
  const handleContentChange = (newContent: string) => {
    if (onContentChange) {
      onContentChange(newContent);
    }
  };
  
  const dimensions = extractDimensionsFromCSS(templateStyles);
  
  // Create a wrapper function that converts handleApplyStyle to return a Promise
  const handleApplyStyleToElement = async (styleId: string): Promise<void> => {
    try {
      // Get the style with inheritance
      const style = await textStyleStore.getStyleWithInheritance(styleId);
      if (!style) {
        throw new Error(`Style with ID "${styleId}" not found`);
      }
      
      // Convert the style to a Record<string, string> for handleApplyStyle
      const styleRecord: Record<string, string> = {
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        color: style.color,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing
      };
      
      // Add optional properties if they exist
      if (style.textAlign) styleRecord.textAlign = style.textAlign;
      if (style.textTransform) styleRecord.textTransform = style.textTransform;
      if (style.textDecoration) styleRecord.textDecoration = style.textDecoration;
      
      // Apply the style to the element
      handleApplyStyle(styleRecord);
      
      // Set data attribute for the style ID
      if (selectedElement) {
        selectedElement.setAttribute('data-style-id', styleId);
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error applying style:", error);
      return Promise.reject(error);
    }
  };
  
  return (
    <div className="bg-editor-panel rounded-md">
      {!isEditable && selectedElement && (
        <SelectedElementBar 
          selectedElement={selectedElement}
          onApplyStyle={handleApplyStyleToElement}
        />
      )}
      
      <div className="prose prose-sm max-w-none">
        <DocumentStyles customStyles={isEditable ? '' : templateStyles} />
        
        {isEditable ? (
          <EditableContent
            content={content}
            onContentChange={handleContentChange}
            hideToolbar={isDesigner}
            renderToolbarOutside={renderToolbarOutside}
            externalToolbar={externalToolbar}
            editorInstance={editorInstance}
            templateStyles={templateStyles}
          />
        ) : content ? (
          <ViewableContent
            content={content}
            previewRef={previewRef}
            onClick={handlePreviewClick}
            templateStyles={templateStyles}
            templateName={templateName}
            templateVersion={templateVersion}
            templateId={templateId}
          />
        ) : (
          <EmptyContent dimensions={dimensions} />
        )}
      </div>
    </div>
  );
};
