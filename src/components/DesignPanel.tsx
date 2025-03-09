
import type { DesignPanelProps } from "@/lib/types";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";
import { useEditorSetup } from "@/components/rich-text/useEditor";
import { getPreviewVisibilityPreference, setPreviewVisibilityPreference } from "@/components/editor-nav/EditorNavUtils";
import { DesignerToolbar } from "@/components/design/DesignerToolbar";
import { DesignerContent } from "@/components/design/DesignerContent";
import { EditorContent } from "@/components/design/EditorContent";

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
  
  const handleElementSelect = (element: HTMLElement | null) => {
    setSelectedElement(element);
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
          <DesignerToolbar
            editor={editorSetup?.editor}
            currentFont={editorSetup?.currentFont || 'Inter'}
            currentColor={editorSetup?.currentColor || '#000000'}
            onFontChange={editorSetup?.handleFontChange || (() => {})}
            onColorChange={editorSetup?.handleColorChange || (() => {})}
            isPreviewVisible={isPreviewVisible}
            onTogglePreview={handleTogglePreview}
          />
        )}
        <DesignerContent
          isPreviewVisible={isPreviewVisible}
          designContent={designContent}
          customStyles={customStyles}
          isEditable={isEditable}
          onContentChange={handleContentChange}
          onElementSelect={handleElementSelect}
          editor={editorSetup?.editor || null}
        />
      </div>
    );
  }
  
  return (
    <EditorContent
      isEditable={isEditable}
      designContent={designContent}
      customStyles={customStyles}
      onContentChange={handleContentChange}
      onElementSelect={handleElementSelect}
      isMobile={isMobile}
      isStandalone={isStandalone}
    />
  );
};
