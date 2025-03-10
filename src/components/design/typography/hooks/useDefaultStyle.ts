
import { useMemo, useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { Editor } from "@tiptap/react";
import { useToast } from "@/hooks/use-toast";
import { textStyleStore } from "@/stores/textStyles";

export const useDefaultStyle = (editorInstance?: Editor | null) => {
  const { toast } = useToast();
  const [customDefaultStyle, setCustomDefaultStyle] = useState<TextStyle | null>(null);

  // Load the saved default style on mount
  useEffect(() => {
    const loadCustomDefaultStyle = async () => {
      try {
        const defaultStyle = await textStyleStore.getDefaultStyle();
        if (defaultStyle) {
          setCustomDefaultStyle(defaultStyle);
        }
      } catch (error) {
        console.error('Error loading custom default style:', error);
      }
    };
    
    loadCustomDefaultStyle();
  }, []);

  const defaultTextStyle: TextStyle = useMemo(() => ({
    id: 'default-text-reset',
    name: 'Clear to Default',
    fontFamily: customDefaultStyle?.fontFamily || 'Inter',
    fontSize: customDefaultStyle?.fontSize || '16px',
    fontWeight: customDefaultStyle?.fontWeight || '400',
    color: customDefaultStyle?.color || '#000000',
    lineHeight: customDefaultStyle?.lineHeight || '1.5',
    letterSpacing: customDefaultStyle?.letterSpacing || '0',
    textAlign: customDefaultStyle?.textAlign || 'left',
    selector: 'span, div',
    description: 'Reset to default text formatting',
    isSystem: true,
    isPersistent: true,
    isUsed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }), [customDefaultStyle]);

  const saveAsDefaultStyle = async () => {
    if (!editorInstance) {
      return;
    }

    try {
      // Get current styles from the editor
      const currentFont = editorInstance.getAttributes('textStyle')?.fontFamily || defaultTextStyle.fontFamily;
      const currentSize = editorInstance.getAttributes('textStyle')?.fontSize || defaultTextStyle.fontSize;
      const currentWeight = editorInstance.getAttributes('textStyle')?.fontWeight || defaultTextStyle.fontWeight;
      const currentColor = editorInstance.getAttributes('textStyle')?.color || defaultTextStyle.color;
      const currentLineHeight = editorInstance.getAttributes('textStyle')?.lineHeight || defaultTextStyle.lineHeight;
      const currentLetterSpacing = editorInstance.getAttributes('textStyle')?.letterSpacing || defaultTextStyle.letterSpacing;
      const currentTextAlign = editorInstance.getAttributes('textStyle')?.textAlign || defaultTextStyle.textAlign;
      
      // Create an updated default style
      const newDefaultStyle: TextStyle = {
        ...defaultTextStyle,
        fontFamily: currentFont,
        fontSize: currentSize,
        fontWeight: currentWeight,
        color: currentColor,
        lineHeight: currentLineHeight,
        letterSpacing: currentLetterSpacing,
        textAlign: currentTextAlign,
        updated_at: new Date().toISOString()
      };
      
      // Save it as the default style
      await textStyleStore.saveTextStyle({
        ...newDefaultStyle,
        isDefault: true
      });
      
      // Update the local state
      setCustomDefaultStyle(newDefaultStyle);
      
      toast({
        title: "Default style updated",
        description: "Current font settings saved as the default style"
      });
    } catch (error) {
      console.error('Error saving default style:', error);
      toast({
        title: "Error saving default style",
        description: "Could not save the current font settings as default",
        variant: "destructive"
      });
    }
  };

  const applyDefaultTextStyle = async () => {
    if (!editorInstance) {
      return;
    }

    try {
      const defaultStyle = await textStyleStore.getDefaultStyle() || defaultTextStyle;
      
      editorInstance.chain()
        .focus()
        .unsetAllMarks()
        .setFontFamily(null)
        .setFontSize(null)
        .setColor(null)
        .run();
        
      if (defaultStyle) {
        editorInstance.chain()
          .focus()
          .setFontFamily(defaultStyle.fontFamily || 'Inter')
          .setFontSize(defaultStyle.fontSize || '16px')
          .setColor(defaultStyle.color || '#000000')
          .run();
          
        toast({
          title: "Default style applied",
          description: "Text has been reset to default formatting"
        });
      }
    } catch (error) {
      console.error('Error applying default style:', error);
      toast({
        title: "Error applying default style",
        description: "Could not reset text formatting",
        variant: "destructive"
      });
    }
  };

  return {
    defaultTextStyle,
    applyDefaultTextStyle,
    saveAsDefaultStyle
  };
};
