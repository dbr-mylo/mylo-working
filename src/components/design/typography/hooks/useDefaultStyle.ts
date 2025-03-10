
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
      
      // Log information about what's being applied
      console.log('Applying default style. Stored default:', storedDefaultStyle ? 
        `Font: ${storedDefaultStyle.fontFamily}` : 'None available');
        
      if (storedDefaultStyle) {
        // Apply stored default style if available
        editorInstance.chain()
          .focus()
          .setFontFamily(storedDefaultStyle.fontFamily || 'Inter')
          .setFontSize(storedDefaultStyle.fontSize || '16px')
          .setColor(storedDefaultStyle.color || '#000000')
          .run();
          
        console.log('Applied stored default style:', storedDefaultStyle.fontFamily);
      } else {
        // Apply fallback default style - ensure we're using 'Inter' here
        console.log('No stored default style, applying fallback Inter');
        editorInstance.chain()
          .focus()
          .setFontFamily('Inter')  // Explicitly set to 'Inter', not using variable
          .setFontSize('16px')
          .setColor('#000000')
          .run();
      }
      
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
    } catch (error) {
      console.error('Error applying default style:', error);
      
      // In case of error, apply a hardcoded default style to ensure consistency
      editorInstance.chain()
        .focus()
        .setFontFamily('Inter')
        .setFontSize('16px')
        .setColor('#000000')
        .run();
        
      // Force selection update even in error case
      const currentSelection = editorInstance.state.selection;
      editorInstance.commands.setTextSelection({
        from: currentSelection.from,
        to: currentSelection.to
      });
      
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
