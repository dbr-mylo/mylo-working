
import type { DesignPanelProps } from "@/lib/types";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useAuth } from "@/contexts/AuthContext";
import { useEditorSetup } from "@/components/rich-text/useEditor";
import { ToolSettingsMenuBar } from "@/components/design/ToolSettingsMenuBar";
import { DesignerSidebar } from "@/components/design/DesignerSidebar";
import { DesignerToolbar } from "@/components/design/DesignerToolbar";
import { DesignerContent } from "@/components/design/DesignerContent";
import { DesignerPreview } from "@/components/design/DesignerPreview";
import { useDesignPanel } from "@/components/design/hooks/useDesignPanel";

export const DesignPanel = ({ content, isEditable }: DesignPanelProps) => {
  const { width } = useWindowSize();
  const { role } = useAuth();
  const isMobile = width < 1281;
  const isStandalone = role === "designer";
  
  const {
    designContent,
    customStyles,
    selectedElement,
    isPreviewVisible,
    handleContentChange,
    handleElementSelect,
    handleTogglePreview
  } = useDesignPanel({
    content,
    isEditable,
    isStandalone
  });
  
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
            <DesignerToolbar 
              editor={editorSetup?.editor || null}
              currentFont={editorSetup?.currentFont}
              currentColor={editorSetup?.currentColor}
              onFontChange={editorSetup?.handleFontChange}
              onColorChange={editorSetup?.handleColorChange}
              isPreviewVisible={isPreviewVisible}
              onTogglePreview={handleTogglePreview}
            />
          </div>
        )}
        
        <div className="flex flex-row flex-1">
          <div className={isPreviewVisible ? "w-1/2 bg-editor-panel overflow-auto border-r border-editor-border" : "w-full bg-editor-panel overflow-auto"}>
            <DesignerContent 
              content={designContent}
              customStyles={customStyles}
              isEditable={isEditable}
              onContentChange={handleContentChange}
              onElementSelect={handleElementSelect}
              editor={editorSetup?.editor}
            />
          </div>
          
          {isPreviewVisible && (
            <div className="w-1/2 bg-white overflow-auto">
              <DesignerPreview content={designContent} />
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
