
import { StyleSelectionInfo } from "./StyleSelectionInfo";
import { useStyleSelection, SelectedTextInfo } from "@/hooks/useStyleSelection";
import { Editor } from "@tiptap/react";
import { useState, useEffect } from "react";

interface EditorStyleControlsProps {
  editor: Editor | null;
}

export const EditorStyleControls = ({ editor }: EditorStyleControlsProps) => {
  const { selectedInfo, applyTextStyle } = useStyleSelection(editor);
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  
  // Toggle visibility when selection changes
  useEffect(() => {
    if (editor && (selectedInfo.hasSelection || editor.isFocused())) {
      setIsControlsVisible(true);
    } else {
      // Add a small delay before hiding to avoid flickering
      const timer = setTimeout(() => {
        if (!editor?.isFocused()) {
          setIsControlsVisible(false);
        }
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [selectedInfo, editor]);
  
  // Focus handler to show controls when editor is focused
  useEffect(() => {
    if (!editor) return;
    
    const handleFocus = () => {
      setIsControlsVisible(true);
    };
    
    const handleBlur = () => {
      // Only hide if there's no selection
      if (!selectedInfo.hasSelection) {
        setTimeout(() => setIsControlsVisible(false), 200);
      }
    };
    
    editor.on('focus', handleFocus);
    editor.on('blur', handleBlur);
    
    return () => {
      editor.off('focus', handleFocus);
      editor.off('blur', handleBlur);
    };
  }, [editor, selectedInfo]);
  
  if (!editor) return null;
  
  return (
    <div className="ml-4 flex-1">
      <StyleSelectionInfo 
        selectedInfo={selectedInfo}
        onApplyStyle={applyTextStyle}
        visible={isControlsVisible}
      />
    </div>
  );
};
