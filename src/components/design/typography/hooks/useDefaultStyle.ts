
import { useMemo, useState, useEffect, useCallback } from "react";
import { TextStyle } from "@/lib/types";
import { Editor } from "@tiptap/react";
import { useToast } from "@/hooks/use-toast";
import { textStyleStore } from "@/stores/textStyles";

export const useDefaultStyle = (editorInstance?: Editor | null) => {
  const { toast } = useToast();
  const [customDefaultStyle, setCustomDefaultStyle] = useState<TextStyle | null>(null);

  // Load the saved default style on mount and when it changes
  const loadCustomDefaultStyle = useCallback(async () => {
    try {
      const defaultStyle = await textStyleStore.getDefaultStyle(true);
      if (defaultStyle) {
        console.log("Loaded default style:", defaultStyle);
        setCustomDefaultStyle(defaultStyle);
      }
    } catch (error) {
      console.error('Error loading custom default style:', error);
    }
  }, []);
  
  useEffect(() => {
    loadCustomDefaultStyle();
    
    // Set up a listener to reload when local storage changes
    const handleStorageChange = () => {
      loadCustomDefaultStyle();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadCustomDefaultStyle]);

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

  const applyDefaultTextStyle = async () => {
    if (!editorInstance) {
      return;
    }

    try {
      // Force refresh to get the latest default style
      const defaultStyle = await textStyleStore.getDefaultStyle(true) || defaultTextStyle;
      
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

  // Force refresh the default style
  const refreshDefaultStyle = () => {
    loadCustomDefaultStyle();
  };

  return {
    defaultTextStyle,
    applyDefaultTextStyle,
    refreshDefaultStyle
  };
};
