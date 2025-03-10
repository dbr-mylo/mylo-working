
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
      onContentChange: handleContentChange,
      isEditable 
    }) : null;
  
  if (isStandalone) {
    return (
      <div className="w-full flex flex-col">
        {isEditable && (
          <div className="w-full">
            {/* Combined toolbar with proper alignment */}
            <div className="bg-white border-b border-slate-200 z-10">
              <div className="flex items-center justify-between px-4">
                {editorSetup?.editor && (
                  <div className="flex-1 py-2">
                    <EditorToolbar 
                      editor={editorSetup.editor}
                      currentFont={editorSetup.currentFont}
                      currentColor={editorSetup.currentColor}
                      onFontChange={editorSetup.handleFontChange}
                      onColorChange={editorSetup.handleColorChange}
                    />
                  </div>
                )}
                <div className="flex items-center h-full">
                  <button
                    onClick={handleTogglePreview}
                    className="flex items-center gap-2 h-7 px-3 text-xs border border-gray-200 rounded bg-white hover:bg-gray-50"
                  >
                    {isPreviewVisible ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                        <span>Preview</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Preview</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
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
                  renderToolbarOutside={true}
                  externalToolbar={isEditable}
                  editorInstance={editorSetup?.editor}
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
                    dangerouslySetInnerHTML={{ __html: designContent }} 
                    className="min-h-[11in] w-[8.5in] p-[1in] mx-auto bg-gray-50 border border-gray-200 rounded-md prose prose-sm max-w-none"
                  />
                </div>
              </div>
            </div>
          )}
          
          <DesignerSidebar editorInstance={editorSetup?.editor} />
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
