
/**
 * ViewableContent Component
 * 
 * WARNING: This component contains role-specific rendering logic.
 * Changes to the designer role functionality (isDesigner === true) should be avoided.
 * Only modify the editor role section unless absolutely necessary.
 * 
 * The designer code path (first return after useEffect) should remain unchanged.
 */

import { useRef, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { extractDimensionsFromCSS } from "@/utils/templateUtils";

interface ViewableContentProps {
  content: string;
  previewRef: React.RefObject<HTMLDivElement>;
  onClick: (e: React.MouseEvent) => void;
  templateStyles?: string;
  templateName?: string;
}

export const ViewableContent = ({ 
  content, 
  previewRef, 
  onClick,
  templateStyles = '',
  templateName = ''
}: ViewableContentProps) => {
  const { role } = useAuth();
  const { toast } = useToast();
  const isDesigner = role === "designer";
  const [prevTemplateName, setPrevTemplateName] = useState(templateName);
  
  // Extract dimensions from template styles
  const dimensions = extractDimensionsFromCSS(templateStyles);
  const width = dimensions?.width || '8.5in';
  const height = dimensions?.height || '11in';

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

  // Apply Google Fonts for testing
  const testingFontStyles = `
    /* Test font styles for Designer preview */
    .template-styled {
      font-family: 'Playfair Display', serif !important;
      color: #333 !important;
    }
    
    .template-styled h1 {
      font-family: 'Playfair Display', serif !important;
      font-weight: 700 !important;
      color: #1a365d !important;
      font-size: 2.25rem !important;
    }
    
    .template-styled h2 {
      font-family: 'Playfair Display', serif !important;
      font-weight: 700 !important;
      color: #2a4365 !important;
      font-size: 1.875rem !important;
    }
  `;

  // DESIGNER PATH - Apply test fonts for demonstration
  if (isDesigner) {
    const designerStyles = templateStyles || testingFontStyles;
    
    return (
      <>
        {designerStyles && <style dangerouslySetInnerHTML={{ __html: designerStyles }} />}
        <div 
          ref={previewRef} 
          onClick={onClick}
          dangerouslySetInnerHTML={{ __html: content }} 
          className={`cursor-pointer min-h-[${height}] w-[${width}] p-[1in] mx-auto mt-0 template-styled bg-white border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]`}
        />
      </>
    );
  } 

  // EDITOR PATH - Enhanced to override editor styling and enforce template styles
  return (
    <div className={`min-h-[${height}] w-[${width}] p-[1in] mx-auto mt-0 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]`}>
      {/* Apply template styles with high specificity to override editor choices */}
      {templateStyles && (
        <style dangerouslySetInnerHTML={{ 
          __html: `
            /* Template styles with higher specificity to override editor choices */
            .template-styled * {
              font-family: inherit !important;
              color: inherit !important;
              text-align: inherit !important;
            }
            
            /* Add additional template style overrides */
            ${templateStyles}
            
            /* Force template typography settings */
            .template-styled [style*="font-family"],
            .template-styled [style*="color"],
            .template-styled [style*="text-align"] {
              font-family: inherit !important;
              color: inherit !important;
              text-align: inherit !important;
            }
          `
        }} />
      )}
      <div 
        ref={previewRef} 
        onClick={onClick}
        dangerouslySetInnerHTML={{ __html: content }} 
        className="cursor-pointer template-styled" 
      />
    </div>
  );
};
