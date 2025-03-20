
import { Editor } from "@tiptap/react";
import { useState, useCallback } from "react";
import { textStyleStore } from "@/stores/textStyles";
import { TextStyle } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export const useStyleApplication = (editor: Editor) => {
  const [isApplyingStyle, setIsApplyingStyle] = useState(false);
  const { toast } = useToast();

  /**
   * Applies a text style to the current selection in the editor
   */
  const applyStyleToSelection = useCallback(async (styleId: string) => {
    if (!editor || editor.state.selection.empty) {
      console.log("No selection to apply style to");
      return;
    }

    try {
      setIsApplyingStyle(true);
      
      // Get all styles to find the one we want to apply
      const styles = await textStyleStore.getTextStyles();
      const styleToApply = styles.find(s => s.id === styleId);
      
      if (!styleToApply) {
        throw new Error(`Style with ID ${styleId} not found`);
      }
      
      console.log("Applying style:", styleToApply.name);
      
      // Get the complete style with inheritance
      const completeStyle = await textStyleStore.getStyleWithInheritance(styleId);
      
      // Apply the style to the selected text
      editor.chain().focus().setMark('textStyle', { 
        id: styleId,
        // Include other style properties for direct rendering
        ...completeStyle
      }).run();
      
      return completeStyle;
    } catch (error) {
      console.error("Error applying style:", error);
      toast({
        title: "Error applying style",
        description: "There was a problem applying the selected style.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsApplyingStyle(false);
    }
  }, [editor, toast]);

  /**
   * Gets the current style applied to the selection
   */
  const getCurrentStyle = useCallback(async (): Promise<TextStyle | null> => {
    if (!editor || editor.state.selection.empty) {
      return null;
    }
    
    try {
      const marks = editor.state.selection.$head.marks();
      const textStyleMark = marks.find(mark => mark.type.name === 'textStyle');
      
      if (!textStyleMark) {
        return null;
      }
      
      const styleId = textStyleMark.attrs.id;
      if (!styleId) {
        return null;
      }
      
      // Get all styles to find the one applied
      const styles = await textStyleStore.getTextStyles();
      return styles.find(s => s.id === styleId) || null;
    } catch (error) {
      console.error("Error getting current style:", error);
      return null;
    }
  }, [editor]);

  /**
   * Removes any text style from the current selection
   */
  const removeStyleFromSelection = useCallback(() => {
    if (!editor || editor.state.selection.empty) {
      return;
    }
    
    try {
      editor.chain().focus().unsetMark('textStyle').run();
      
      // Also clear any "Clear to Default" styles from cache
      textStyleStore.clearDefaultResetStyle();
    } catch (error) {
      console.error("Error removing style:", error);
    }
  }, [editor]);

  return {
    applyStyleToSelection,
    getCurrentStyle,
    removeStyleFromSelection,
    isApplyingStyle
  };
};
