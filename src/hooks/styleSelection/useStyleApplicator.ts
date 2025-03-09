
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
      // Start a transaction
      editor.chain().focus();
      
      // Apply each style property
      Object.entries(styleProperties).forEach(([property, value]) => {
        switch (property) {
          case "fontFamily":
            editor.chain().setFontFamily(value).run();
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
            editor.chain().setColor(value).run();
            break;
          case "textAlign":
            // Text alignment requires a separate extension that's not currently available
            // For now, we'll just focus the editor but do nothing for text alignment
            if (value === 'left') editor.chain().focus().run();
            else if (value === 'center') editor.chain().focus().run();
            else if (value === 'right') editor.chain().focus().run();
            else if (value === 'justify') editor.chain().focus().run();
            break;
          default:
            // For any other properties, try to apply via TextStyle
            const styleUpdate = { [property]: value };
            editor.commands.updateAttributes('textStyle', styleUpdate);
        }
      });

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
