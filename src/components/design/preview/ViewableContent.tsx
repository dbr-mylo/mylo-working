
/**
 * ViewableContent Component
 * 
 * This component displays the document content with appropriate styling based on user role.
 * It handles template application for both designers and editors.
 */

import { useRef, useState } from "react";
import { useIsDesigner, useIsAdmin, useIsWriter } from "@/utils/roles";
import { extractDimensionsFromCSS } from "@/utils/templateUtils";
import { DesignerViewContent } from "./DesignerViewContent";
import { EditorViewContent } from "./EditorViewContent";
import { useTemplateNotification } from "./hooks/useTemplateNotification";
import { templateService } from "@/services/template";

interface ViewableContentProps {
  content: string;
  previewRef: React.RefObject<HTMLDivElement>;
  onClick: (e: React.MouseEvent) => void;
  templateStyles?: string;
  templateName?: string;
  templateVersion?: number;
  templateId?: string;
}

export const ViewableContent = ({ 
  content, 
  previewRef, 
  onClick,
  templateStyles = '',
  templateName = '',
  templateVersion = 1,
  templateId = ''
}: ViewableContentProps) => {
  const isDesigner = useIsDesigner();
  const isAdmin = useIsAdmin();
  const isWriter = useIsWriter();
  const [loadedStyles, setLoadedStyles] = useState(templateStyles);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  
  // Use the notification hook
  useTemplateNotification(templateName, isLoadingTemplate);
  
  // Extract dimensions from template styles
  const dimensions = extractDimensionsFromCSS(loadedStyles || templateStyles);
  const width = dimensions?.width || '8.5in';
  const height = dimensions?.height || '11in';

  // Fetch template from Supabase if templateId is provided
  useState(() => {
    if (templateId && !templateStyles) {
      const fetchTemplate = async () => {
        setIsLoadingTemplate(true);
        try {
          const template = await templateService.getTemplateById(templateId);
          if (template) {
            setLoadedStyles(template.styles);
          }
        } catch (error) {
          console.error("Error loading template:", error);
        } finally {
          setIsLoadingTemplate(false);
        }
      };
      
      fetchTemplate();
    }
  });

  // Get the appropriate styles to use
  const stylesContent = loadedStyles || templateStyles;

  // DESIGNER/ADMIN PATH
  if (isDesigner || isAdmin) {
    return (
      <DesignerViewContent
        content={content}
        previewRef={previewRef}
        onClick={onClick}
        stylesContent={stylesContent}
        isLoadingTemplate={isLoadingTemplate}
        width={width}
        height={height}
        isDesigner={isDesigner}
      />
    );
  } 

  // WRITER PATH
  return (
    <EditorViewContent
      content={content}
      previewRef={previewRef}
      onClick={onClick}
      stylesContent={stylesContent}
      isLoadingTemplate={isLoadingTemplate}
      width={width}
      height={height}
    />
  );
};
