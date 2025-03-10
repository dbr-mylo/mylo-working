
import { useMemo } from "react";
import { TextStyle } from "@/lib/types";
import { Editor } from "@tiptap/react";
import { useToast } from "@/hooks/use-toast";
import { getDefaultStyle } from "@/stores/textStyles/utils";

export const useDefaultStyle = (editorInstance?: Editor | null) => {
  const { toast } = useToast();

  const defaultTextStyle: TextStyle = useMemo(() => ({
    id: 'default-text-reset',
    name: 'Clear to Default',
    fontFamily: 'Inter',
    fontSize: '16px',
    fontWeight: '400',
    color: '#000000',
    lineHeight: '1.5',
    letterSpacing: '0',
    selector: 'span, div',
    description: 'Reset to default text formatting',
    isSystem: true,
    isPersistent: true,
    isUsed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }), []);

  const applyDefaultTextStyle = async () => {
    if (!editorInstance) {
      return;
    }

    try {
      // Reset all marks and styles first
      editorInstance.chain()
        .focus()
        .unsetAllMarks()
        .run();
      
      // Reset text alignment and other paragraph attributes
      editorInstance.chain()
        .focus()
        .setParagraph()
        .run();
      
      // Explicitly set the font family to Inter, font size to 16px, and color to black
      // Make sure each step is separate to ensure all properties are set correctly
      editorInstance.chain()
        .focus()
        .setFontFamily('Inter')
        .run();
        
      editorInstance.chain()
        .focus()
        .setFontSize('16px')
        .run();
        
      editorInstance.chain()
        .focus()
        .setColor('#000000')
        .run();
        
      // Force an update to the selection to refresh the toolbar state
      const currentSelection = editorInstance.state.selection;
      editorInstance.commands.setTextSelection({
        from: currentSelection.from,
        to: currentSelection.to
      });
    } catch (error) {
      console.error('Error applying default style:', error);
      
      // In case of error, still try to set the font to Inter
      if (editorInstance) {
        try {
          // Make separate calls to ensure each property is set
          editorInstance.chain().focus().setFontFamily('Inter').run();
          editorInstance.chain().focus().setFontSize('16px').run();
          editorInstance.chain().focus().setColor('#000000').run();
        } catch (e) {
          console.error('Failed to apply fallback style:', e);
        }
      }
      
      toast({
        title: "Error applying default style",
        description: "Could not reset text formatting",
        variant: "destructive"
      });
    }
  };

  return {
    defaultTextStyle,
    applyDefaultTextStyle
  };
};
