
import { useCallback } from "react";
import { Editor } from "@tiptap/react";
import { useToast } from "@/hooks/use-toast";
import { SelectedTextInfo } from "./useSelectionTracker";

export const useStyleApplicator = (
  editor: Editor | null, 
  selectedInfo: SelectedTextInfo
) => {
  const { toast } = useToast();

  // Apply a style to the current selection or at cursor position
  const applyStyle = useCallback((styleProperties: Record<string, any>) => {
    if (!editor) {
      toast({
        title: "No editor available",
        description: "Cannot apply style without an active editor",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Start a transaction and focus the editor
      const chain = editor.chain().focus();
      
      // Apply each style property
      Object.entries(styleProperties).forEach(([property, value]) => {
        switch (property) {
          case "fontFamily":
            chain.setFontFamily(value);
            break;
          case "fontSize":
            // Convert to px if needed and apply
            const fontSize = typeof value === 'string' && value.endsWith('px') 
              ? value 
              : `${value}px`;
            editor.commands.updateAttributes('textStyle', { fontSize });
            break;
          case "fontWeight":
            editor.commands.updateAttributes('textStyle', { fontWeight: value });
            break;
          case "color":
            chain.setColor(value);
            break;
          case "textAlign":
            // Use direct setTextAlign command for alignment
            if (value === 'left') chain.setTextAlign('left');
            else if (value === 'center') chain.setTextAlign('center');
            else if (value === 'right') chain.setTextAlign('right');
            else if (value === 'justify') chain.setTextAlign('justify');
            break;
          default:
            // For any other properties, try to apply via TextStyle
            const styleUpdate = { [property]: value };
            editor.commands.updateAttributes('textStyle', styleUpdate);
        }
      });
      
      // Execute the chain
      chain.run();

      toast({
        title: "Style applied",
        description: selectedInfo.hasSelection 
          ? "Applied style to selected text" 
          : "Applied style at cursor position",
      });
      
      return true;
    } catch (error) {
      console.error("Error applying style:", error);
      toast({
        title: "Error applying style",
        description: "Something went wrong while applying the style",
        variant: "destructive"
      });
      return false;
    }
  }, [editor, selectedInfo, toast]);

  return { applyStyle };
};
