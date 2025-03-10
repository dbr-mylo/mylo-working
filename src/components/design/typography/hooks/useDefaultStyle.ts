
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
      
      // Always use 'Inter' as the primary fallback font
      editorInstance.chain()
        .focus()
        .setFontFamily('Inter')
        .setFontSize('16px')
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
        editorInstance.chain()
          .focus()
          .setFontFamily('Inter')
          .setFontSize('16px')
          .setColor('#000000')
          .run();
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
