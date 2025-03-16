/**
 * ViewableContent Component
 * 
 * This component displays the document content with appropriate styling based on user role.
 * It handles template application for both designers and editors.
 */

import { useRef, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { extractDimensionsFromCSS } from "@/utils/templateUtils";
import { DocumentStyles } from "./DocumentStyles";
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
  const { role } = useAuth();
  const { toast } = useToast();
  const [prevTemplateName, setPrevTemplateName] = useState(templateName);
  const [loadedStyles, setLoadedStyles] = useState(templateStyles);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  
  const isDesigner = role === "designer";
  const isAdmin = role === "admin";
  
  // Extract dimensions from template styles
  const dimensions = extractDimensionsFromCSS(loadedStyles || templateStyles);
  const width = dimensions?.width || '8.5in';
  const height = dimensions?.height || '11in';

  // Fetch template from Supabase if templateId is provided
  useEffect(() => {
    if (templateId && !templateStyles) {
      const fetchTemplate = async () => {
        setIsLoadingTemplate(true);
        try {
          const template = await templateService.getTemplateById(templateId);
          if (template) {
            setLoadedStyles(template.styles);
            if (role === "editor") {
              toast({
                title: "Template Applied",
                description: `The "${template.name}" template has been applied to your document.`,
                duration: 3000,
              });
            }
          }
        } catch (error) {
          console.error("Error loading template:", error);
        } finally {
          setIsLoadingTemplate(false);
        }
      };
      
      fetchTemplate();
    }
  }, [templateId, role, toast]);

  // Notify user when template changes
  useEffect(() => {
    if (templateName && templateName !== prevTemplateName && role === "editor") {
      toast({
        title: "Template Applied",
        description: `The "${templateName}" template has been applied to your document.`,
        duration: 3000,
      });
      setPrevTemplateName(templateName);
    }
  }, [templateName, prevTemplateName, toast, role]);

  // Get the appropriate styles to use
  const stylesContent = loadedStyles || templateStyles;

  // Apply additional styling for design role preview
  const designerPreviewStyles = `
    /* Additional styles for designer preview */
    .designer-preview h1 {
      color: #1a365d;
    }
    
    .designer-preview h2 {
      color: #2a4365;
    }
  `;

  // DESIGNER/ADMIN PATH
  if (isDesigner || isAdmin) {
    return (
      <>
        {isLoadingTemplate ? (
          <div className="flex items-center justify-center h-[11in] w-full">
            <div className="animate-pulse text-gray-500">Loading template...</div>
          </div>
        ) : (
          <>
            <DocumentStyles customStyles={`
              ${stylesContent}
              ${isDesigner ? designerPreviewStyles : ''}
            `} />
            <div 
              ref={previewRef} 
              onClick={onClick}
              dangerouslySetInnerHTML={{ __html: content }} 
              className={`cursor-pointer min-h-[${height}] w-[${width}] p-[1in] mx-auto mt-0 designer-preview template-styled bg-white border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]`}
            />
          </>
        )}
      </>
    );
  } 

  // EDITOR PATH
  return (
    <>
      {isLoadingTemplate ? (
        <div className="flex items-center justify-center h-[11in] w-full">
          <div className="animate-pulse text-gray-500">Loading template...</div>
        </div>
      ) : (
        <div className={`min-h-[${height}] w-[${width}] p-[1in] mx-auto mt-0 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]`}>
          {/* Apply template styles with high specificity to override editor choices */}
          {stylesContent && (
            <DocumentStyles customStyles={`
              /* Template styles with higher specificity for editor view */
              .template-styled * {
                font-family: inherit !important;
                color: inherit !important;
                text-align: inherit !important;
              }
              
              /* Add template styles */
              ${stylesContent}
              
              /* Force template typography settings */
              .template-styled [style*="font-family"],
              .template-styled [style*="color"],
              .template-styled [style*="text-align"] {
                font-family: inherit !important;
                color: inherit !important;
                text-align: inherit !important;
              }
            `} />
          )}
          <div 
            ref={previewRef} 
            onClick={onClick}
            dangerouslySetInnerHTML={{ __html: content }} 
            className="cursor-pointer template-styled" 
          />
        </div>
      )}
    </>
  );
};
