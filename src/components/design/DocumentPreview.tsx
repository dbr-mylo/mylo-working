import { RichTextEditor } from "@/components/RichTextEditor";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { StyleApplicator } from "./typography/StyleApplicator";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";

interface DocumentPreviewProps {
  content: string;
  customStyles: string;
  isEditable: boolean;
  onContentChange?: (content: string) => void;
  onElementSelect?: (element: HTMLElement | null) => void;
  renderToolbarOutside?: boolean;
}

export const DocumentPreview = ({ 
  content, 
  customStyles, 
  isEditable, 
  onContentChange,
  onElementSelect,
  renderToolbarOutside = false
}: DocumentPreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const { role } = useAuth();
  const { toast } = useToast();
  const isDesigner = role === "designer";
  
  const handleContentChange = (newContent: string) => {
    if (onContentChange) {
      onContentChange(newContent);
    }
  };
  
  // Handle element selection in preview
  const handlePreviewClick = (e: React.MouseEvent) => {
    if (!isEditable && onElementSelect) {
      // Find the deepest text element
      let target = e.target as HTMLElement;
      
      // If clicking directly on the container, deselect
      if (target === previewRef.current) {
        setSelectedElement(null);
        if (onElementSelect) onElementSelect(null);
        return;
      }
      
      // Look for valid text elements
      while (target && !['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'LI', 'BLOCKQUOTE'].includes(target.tagName)) {
        if (!target.parentElement || target.parentElement === previewRef.current) break;
        target = target.parentElement;
      }
      
      // Update selection
      setSelectedElement(target);
      if (onElementSelect) onElementSelect(target);
      
      // Add selected styling
      // Remove previous selections
      document.querySelectorAll('.text-element-selected').forEach(el => {
        el.classList.remove('text-element-selected');
      });
      
      // Add selection to current element
      if (target) {
        target.classList.add('text-element-selected');
      }
    }
  };
  
  // Clean up selection when component unmounts
  useEffect(() => {
    return () => {
      document.querySelectorAll('.text-element-selected').forEach(el => {
        el.classList.remove('text-element-selected');
      });
    };
  }, []);

  // Handle applying a style to the selected element
  const handleApplyStyle = async (styleId: string) => {
    if (!selectedElement) return;
    
    try {
      // Get the style with all inherited properties
      const styleToApply = await textStyleStore.getStyleWithInheritance(styleId);
      
      if (!styleToApply) {
        toast({
          title: "Style not found",
          description: "The selected style could not be found.",
          variant: "destructive",
        });
        return;
      }
      
      // Apply the style to the selected element
      selectedElement.style.fontFamily = styleToApply.fontFamily;
      selectedElement.style.fontSize = styleToApply.fontSize;
      selectedElement.style.fontWeight = styleToApply.fontWeight;
      selectedElement.style.color = styleToApply.color;
      selectedElement.style.lineHeight = styleToApply.lineHeight;
      selectedElement.style.letterSpacing = styleToApply.letterSpacing;
      
      if (styleToApply.textAlign) {
        selectedElement.style.textAlign = styleToApply.textAlign;
      }
      
      if (styleToApply.textTransform) {
        selectedElement.style.textTransform = styleToApply.textTransform;
      }
      
      if (styleToApply.textDecoration) {
        selectedElement.style.textDecoration = styleToApply.textDecoration;
      }
      
      if (styleToApply.marginTop) {
        selectedElement.style.marginTop = styleToApply.marginTop;
      }
      
      if (styleToApply.marginBottom) {
        selectedElement.style.marginBottom = styleToApply.marginBottom;
      }
      
      // Apply any custom properties
      if (styleToApply.customProperties) {
        Object.entries(styleToApply.customProperties).forEach(([property, value]) => {
          selectedElement.style[property as any] = value;
        });
      }
      
      // Add a class based on the style selector if it exists and doesn't start with a dot
      if (styleToApply.selector && !styleToApply.selector.startsWith('.')) {
        // Remove existing style classes
        selectedElement.className = selectedElement.className
          .split(' ')
          .filter(c => !c.startsWith('style-'))
          .join(' ');
        
        // Add new style class
        selectedElement.classList.add(`style-${styleToApply.id}`);
      }
      
      toast({
        title: "Style applied",
        description: `Applied "${styleToApply.name}" to the selected element.`,
      });
    } catch (error) {
      console.error("Error applying style:", error);
      toast({
        title: "Error applying style",
        description: "There was a problem applying the style.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="bg-editor-panel p-4 rounded-md">
      {!isEditable && selectedElement && (
        <div className="mb-4 flex justify-between items-center bg-background p-2 rounded-md">
          <div className="text-sm">
            <span className="font-medium">Selected: </span>
            <span className="text-muted-foreground">{selectedElement.tagName.toLowerCase()}</span>
          </div>
          <StyleApplicator 
            onApplyStyle={handleApplyStyle}
            selectedElement={selectedElement}
          />
        </div>
      )}
      <div className="prose prose-sm max-w-none">
        {/* For designer role, don't use the white div with shadow */}
        <style>
          {`
            .prose p {
              margin-top: 0;
              margin-bottom: 4px;
              line-height: 1.2;
            }
            .prose ul, .prose ol {
              margin-top: 0;
              margin-bottom: 0;
              padding-left: 20px;
            }
            .prose li {
              margin-bottom: 4px;
              line-height: 1.2;
            }
            .prose li p {
              margin: 0;
            }
            .prose ul ul, .prose ol ol, .prose ul ol, .prose ol ul {
              margin-top: 4px;
            }
            .prose li > ul, .prose li > ol {
              padding-left: 24px;
            }
            .text-element-selected {
              outline: 2px solid #6366f1;
              background-color: rgba(99, 102, 241, 0.1);
            }
            ${customStyles}
          `}
        </style>
        {isEditable ? (
          isDesigner ? (
            // For designer role, don't wrap in the white div
            <RichTextEditor
              content={content}
              onUpdate={handleContentChange}
              isEditable={true}
              hideToolbar={true}
              renderToolbarOutside={renderToolbarOutside}
            />
          ) : (
            // For editor role, keep the white div with shadow
            <div className="min-h-[11in] w-[8.5in] p-[1in] mx-auto bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]">
              <RichTextEditor
                content={content}
                onUpdate={handleContentChange}
                isEditable={true}
                hideToolbar={false}
              />
            </div>
          )
        ) : content ? (
          isDesigner ? (
            // For designer role viewing mode, don't wrap in the white div
            <div 
              ref={previewRef} 
              onClick={handlePreviewClick}
              dangerouslySetInnerHTML={{ __html: content }} 
              className="cursor-pointer min-h-[11in] w-[8.5in] p-[1in] mx-auto" 
            />
          ) : (
            // For editor role viewing mode, keep the white div with shadow
            <div className="min-h-[11in] w-[8.5in] p-[1in] mx-auto bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]">
              <div 
                ref={previewRef} 
                onClick={handlePreviewClick}
                dangerouslySetInnerHTML={{ __html: content }} 
                className="cursor-pointer" 
              />
            </div>
          )
        ) : (
          // Add the white background and shadow for empty content when in editor role
          isDesigner ? (
            // Designer role empty state without white box
            <p className="text-editor-text opacity-50 min-h-[11in] w-[8.5in] p-[1in] mx-auto">
              Content from the editor will appear here with brand styling
            </p>
          ) : (
            // Editor role empty state with white box and shadow
            <div className="min-h-[11in] w-[8.5in] p-[1in] mx-auto bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]">
              <p className="text-editor-text opacity-50">
                Content from the editor will appear here with brand styling
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
