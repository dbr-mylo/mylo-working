
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DocumentStyles } from "./preview/DocumentStyles";
import { EditableContent } from "./preview/EditableContent";
import { ViewableContent } from "./preview/ViewableContent";
import { EmptyContent } from "./preview/EmptyContent";
import { SelectedElementBar } from "./preview/SelectedElementBar";
import { useDocumentPreview } from "./preview/useDocumentPreview";
import { Editor } from "@tiptap/react";
import { templateStore } from "@/stores/templateStore";
import { useToast } from "@/hooks/use-toast";

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
  currentPage?: number;
  totalPages?: number;
}

export const DocumentPreview = ({ 
  content, 
  customStyles, 
  isEditable, 
  onContentChange,
  onElementSelect,
  renderToolbarOutside = false,
  externalToolbar = false,
  editorInstance = null,
  templateId = '',
  currentPage = 0,
  totalPages = 1
}: DocumentPreviewProps) => {
  const { role } = useAuth();
  const { toast } = useToast();
  const isDesigner = role === "designer";
  const isEditor = role === "editor";
  
  const [templateStyles, setTemplateStyles] = useState(customStyles);
  const [templateName, setTemplateName] = useState('');
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  
  const {
    previewRef,
    selectedElement,
    handlePreviewClick,
    handleApplyStyle
  } = useDocumentPreview(onElementSelect);
  
  // Load template when templateId changes
  useEffect(() => {
    const loadTemplate = async () => {
      if (templateId && isEditor) {
        setIsTemplateLoading(true);
        try {
          const template = await templateStore.getTemplateById(templateId);
          if (template) {
            setTemplateStyles(template.styles);
            setTemplateName(template.name);
          }
        } catch (error) {
          console.error("Error loading template:", error);
        } finally {
          setIsTemplateLoading(false);
        }
      } else if (isDesigner) {
        // For designers, use the custom styles directly
        setTemplateStyles(customStyles);
      }
    };
    
    loadTemplate();
  }, [templateId, customStyles, isEditor, isDesigner]);
  
  const handleContentChange = (newContent: string) => {
    if (onContentChange) {
      onContentChange(newContent);
    }
  };
  
  // Default page dimensions if not specified in template
  const defaultPageStyles = `
    .default-page {
      min-height: 11in;
      width: 8.5in;
      padding: 1in;
      margin: 0 auto;
      background-color: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    }
  `;
  
  // Combine default styles with template styles
  const combinedStyles = templateStyles ? templateStyles : defaultPageStyles;
  
  return (
    <div className="bg-editor-panel p-4 rounded-md">
      {/* Show selection bar only when not editable and has selected element */}
      {!isEditable && selectedElement && (
        <SelectedElementBar 
          selectedElement={selectedElement}
          onApplyStyle={handleApplyStyle}
        />
      )}
      
      {/* Page indicator for multi-page documents */}
      {totalPages > 1 && (
        <div className="text-center mb-2 text-sm text-gray-500">
          Page {currentPage + 1} of {totalPages}
        </div>
      )}
      
      <div className="prose prose-sm max-w-none">
        <DocumentStyles customStyles={isEditable ? '' : combinedStyles} />
        
        {isEditable ? (
          <EditableContent
            content={content}
            onContentChange={handleContentChange}
            hideToolbar={isDesigner}
            renderToolbarOutside={renderToolbarOutside}
            externalToolbar={externalToolbar}
            editorInstance={editorInstance}
            templateStyles={''} // Don't apply template styles to editable content
          />
        ) : content ? (
          <ViewableContent
            content={content}
            previewRef={previewRef}
            onClick={handlePreviewClick}
            templateStyles={combinedStyles}
            templateName={templateName}
          />
        ) : (
          <EmptyContent />
        )}
      </div>
    </div>
  );
};
