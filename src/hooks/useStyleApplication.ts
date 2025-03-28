
import { useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { textStyleStore } from '@/stores/textStyles';
import { useToast } from '@/hooks/use-toast';
import { handleError, useRoleAwareErrorHandling } from '@/utils/errorHandling';

export const useStyleApplication = (editor: Editor | null) => {
  const { toast } = useToast();
  const { handleRoleAwareError } = useRoleAwareErrorHandling();

  const applyStyle = useCallback(async (styleId: string) => {
    if (!editor) {
      console.warn("No editor instance available to apply style");
      return;
    }
    
    try {
      // Validate input
      if (!styleId) {
        throw new Error("Invalid style ID provided");
      }
      
      // Get the style with all inherited properties
      const style = await textStyleStore.getStyleWithInheritance(styleId);
      
      if (!style) {
        throw new Error(`Style not found: ${styleId}`);
      }
      
      // Check if there is any selected text
      if (editor.state.selection.empty) {
        toast({
          title: "No text selected",
          description: "Please select some text to apply the style",
        });
        return;
      }
      
      // Apply the style properties to the selected text
      editor.chain().focus();
      
      // Apply font family
      if (style.fontFamily) {
        editor.chain().setFontFamily(style.fontFamily).run();
      }
      
      // Apply font size
      if (style.fontSize) {
        editor.chain().setFontSize(style.fontSize).run();
      }
      
      // Apply font weight
      if (style.fontWeight) {
        const weight = parseInt(style.fontWeight);
        if (weight >= 700) {
          editor.chain().setBold().run();
        } else if (editor.isActive('bold')) {
          editor.chain().toggleBold().run();
        }
      }
      
      // Apply color
      if (style.color) {
        editor.chain().setColor(style.color).run();
      }
      
      // Apply text align
      if (style.textAlign) {
        switch (style.textAlign) {
          case "left":
            editor.chain().setTextAlign("left").run();
            break;
          case "center":
            editor.chain().setTextAlign("center").run();
            break;
          case "right":
            editor.chain().setTextAlign("right").run();
            break;
          case "justify":
            editor.chain().setTextAlign("justify").run();
            break;
        }
      }
      
      toast({
        title: "Style applied",
        description: `Applied "${style.name}" style to text`
      });
      
    } catch (error) {
      handleRoleAwareError(
        error, 
        "useStyleApplication.applyStyle", 
        "Could not apply the style to the selected text"
      );
    }
  }, [editor, toast, handleRoleAwareError]);
  
  return { applyStyle };
};
