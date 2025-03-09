
import { Editor } from "@tiptap/react";
import { TextStyle } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { textStyleStore } from "@/stores/textStyles";

export const useStyleApplication = (editor: Editor | null) => {
  const { toast } = useToast();

  /**
   * Apply a text style to the currently selected text in the editor
   */
  const applyStyleToSelection = async (styleId: string) => {
    if (!editor || !editor.isActive || !editor.chain().focus) {
      toast({
        title: "Editor unavailable",
        description: "Cannot apply style - editor is not ready",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get the style with all inherited properties
      const styleToApply = await textStyleStore.getStyleWithInheritance(styleId);
      
      if (!styleToApply) {
        toast({
          title: "Style not found",
          description: "The selected style could not be found",
          variant: "destructive",
        });
        return;
      }

      // Check if there is any selection
      if (editor.state.selection.empty) {
        toast({
          title: "No text selected",
          description: "Please select some text to apply the style",
          variant: "warning",
        });
        return;
      }

      // Start a chain to apply multiple style properties
      let chain = editor.chain().focus();
      
      // Apply all style properties to the selection
      if (styleToApply.fontFamily) {
        chain = chain.setFontFamily(styleToApply.fontFamily);
      }
      
      if (styleToApply.fontSize) {
        chain = chain.setFontSize(styleToApply.fontSize);
      }
      
      if (styleToApply.color) {
        chain = chain.setColor(styleToApply.color);
      }
      
      if (styleToApply.fontWeight) {
        // Apply bold if the weight is 600+
        const weight = parseInt(styleToApply.fontWeight);
        if (weight >= 600) {
          chain = chain.setBold();
        } else {
          chain = chain.unsetBold();
        }
      }
      
      // Execute all style changes
      chain.run();
      
      toast({
        title: "Style applied",
        description: `Applied "${styleToApply.name}" to selected text`,
      });
      
      // Log to console for debugging
      console.log(`Applied style "${styleToApply.name}" to selection`);
      
    } catch (error) {
      console.error("Error applying style:", error);
      toast({
        title: "Error applying style",
        description: "There was a problem applying the style",
        variant: "destructive",
      });
    }
  };

  return {
    applyStyleToSelection
  };
};
