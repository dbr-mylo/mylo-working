
import type { DesignPanelProps } from "@/lib/types";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DocumentPreview } from "@/components/design/DocumentPreview";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";
import { DesignerSidebar } from "@/components/design/DesignerSidebar";
import { ToolSettingsMenuBar } from "@/components/design/ToolSettingsMenuBar";
import { useEditorSetup } from "@/components/rich-text/useEditor";
import { getPreviewVisibilityPreference, setPreviewVisibilityPreference } from "@/components/editor-nav/EditorNavUtils";
import { EditorToolbar } from "@/components/rich-text/EditorToolbar";

export const DesignPanel = ({ content, isEditable }: DesignPanelProps) => {
  const { width } = useWindowSize();
  const { role } = useAuth();
  const { toast } = useToast();
  const isMobile = width < 1281;
  const isStandalone = role === "designer";
  const [designContent, setDesignContent] = useState(content);
  const [customStyles, setCustomStyles] = useState<string>("");
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  
  const [isPreviewVisible, setIsPreviewVisible] = useState(() => {
    if (isStandalone) {
      return getPreviewVisibilityPreference();
    }
    return true;
  });
  
  useEffect(() => {
    if (isStandalone) {
      setPreviewVisibilityPreference(isPreviewVisible);
    }
  }, [isPreviewVisible, isStandalone]);
  
  if (content !== designContent && !isEditable) {
    setDesignContent(content);
  }
  
  const handleContentChange = (newContent: string) => {
    setDesignContent(newContent);
  };
  
  const handleStylesChange = (styles: string) => {
    setCustomStyles(styles);
  };

  const handleElementSelect = (element: HTMLElement | null) => {
    setSelectedElement(element);
  };
  
  const handleStyleChange = (styles: Record<string, string>) => {
    if (!selectedElement) return;
    
    Object.entries(styles).forEach(([property, value]) => {
      selectedElement.style[property as any] = value;
    });
  };

  const handleSaveStyle = async (styleData: any) => {
    try {
      await textStyleStore.saveTextStyle(styleData);
      
      const styles = await textStyleStore.getTextStyles();
      const css = textStyleStore.generateCSSFromTextStyles(styles);
      setCustomStyles(css);
      
      toast({
        title: "Style saved",
        description: "Text style has been saved to your collection.",
      });
    } catch (error) {
      console.error("Error saving text style:", error);
      toast({
        title: "Error saving style",
        description: "There was a problem saving your text style.",
        variant: "destructive",
      });
    }
  };
  
  const handleTogglePreview = () => {
    setIsPreviewVisible(prev => !prev);
  };
  
  const editorSetup = isEditable && isStandalone ? 
    useEditorSetup({ 
      content: designContent, 
      onUpdate: handleContentChange, 
      isEditable 
    }) : null;
  
  // Removed the toolbar rendering from ToolSettingsMenuBar
  // and added it directly in the component

  const previewContent = `
    <h1>Preview of Your Document</h1>
    <p>This is a preview of how your document will look with the current styling. The content shown here is for demonstration purposes only.</p>
    <h2>Section Heading</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
    <ul>
      <li>First item in a list</li>
      <li>Second item in a list</li>
      <li>Third item with some additional text to show wrapping behavior</li>
    </ul>
    <h3>Subsection Example</h3>
    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae.</p>
    <blockquote>This is an example of a blockquote that might appear in your document.</blockquote>
  `;
  
  if (isStandalone) {
    return (
      <div className="w-full flex flex-col">
        {isEditable && (
          <div className="w-full">
            <ToolSettingsMenuBar 
              isPreviewVisible={isPreviewVisible}
              onTogglePreview={handleTogglePreview}
            />
            {editorSetup?.editor && (
              <div className="bg-white border-b border-slate-200 z-10">
                <EditorToolbar 
                  editor={editorSetup.editor}
                  currentFont={editorSetup.currentFont}
                  currentColor={editorSetup.currentColor}
                  onFontChange={editorSetup.handleFontChange}
                  onColorChange={editorSetup.handleColorChange}
                />
              </div>
            )}
          </div>
        )}
        <div className="flex flex-row flex-1">
          <div className={isPreviewVisible ? "w-1/2 bg-editor-panel overflow-auto border-r border-editor-border" : "w-full bg-editor-panel overflow-auto"}>
            <div className="p-4 md:p-8">
              <div className="mx-auto">
                <DocumentPreview 
                  content={designContent}
                  customStyles={customStyles}
                  isEditable={isEditable}
                  onContentChange={handleContentChange}
                  onElementSelect={handleElementSelect}
                  renderToolbarOutside={isEditable}
                />
              </div>
            </div>
          </div>
          
          {isPreviewVisible && (
            <div className="w-1/2 bg-white overflow-auto">
              <div className="p-4 md:p-8">
                <div className="mb-3">
                  <h3 className="text-base font-medium text-editor-heading mb-2">Document Preview</h3>
                  <div 
                    dangerouslySetInnerHTML={{ __html: previewContent }} 
                    className="min-h-[11in] w-[8.5in] p-[1in] mx-auto bg-gray-50 border border-gray-200 rounded-md prose prose-sm max-w-none"
                  />
                </div>
              </div>
            </div>
          )}
          
          <DesignerSidebar />
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${isStandalone ? 'w-full' : isMobile ? 'w-full' : 'w-1/2'} bg-editor-panel ${!isMobile ? 'animate-slide-in' : ''} overflow-auto`}>
      {isEditable && (
        <div className="w-full">
          <ToolSettingsMenuBar />
        </div>
      )}
      <div className="p-4 md:p-8">
        <div className="mx-auto">
          <DocumentPreview 
            content={designContent}
            customStyles={customStyles}
            isEditable={isEditable}
            onContentChange={handleContentChange}
            onElementSelect={handleElementSelect}
          />
        </div>
      </div>
    </div>
  );
};
