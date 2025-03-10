
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
      // First try to get the user-configured default style
      const storedDefaultStyle = await getDefaultStyle();
      
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
      
      if (storedDefaultStyle) {
        // Apply stored default style if available
        editorInstance.chain()
          .focus()
          .setFontFamily(storedDefaultStyle.fontFamily || 'Inter')
          .setFontSize(storedDefaultStyle.fontSize || '16px')
          .setColor(storedDefaultStyle.color || '#000000')
          .run();
          
        // Force an update to the selection to refresh the toolbar state
        const currentSelection = editorInstance.state.selection;
        editorInstance.commands.setTextSelection({
          from: currentSelection.from,
          to: currentSelection.to
        });
          
        toast({
          title: "Default style applied",
          description: "Text has been reset to default formatting"
        });
      } else {
        // Apply fallback default style
        editorInstance.chain()
          .focus()
          .setFontFamily(defaultTextStyle.fontFamily)
          .setFontSize(defaultTextStyle.fontSize)
          .setColor(defaultTextStyle.color)
          .run();
          
        // Force an update to the selection to refresh the toolbar state
        const currentSelection = editorInstance.state.selection;
        editorInstance.commands.setTextSelection({
          from: currentSelection.from,
          to: currentSelection.to
        });
          
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
    applyDefaultTextStyle
  };
};
