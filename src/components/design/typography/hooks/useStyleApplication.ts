
import { useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";

export const useStyleApplication = (editorInstance: Editor | null) => {
  const { toast } = useToast();

  /**
   * Apply a text style to the currently selected text in the editor
   * @param styleId The ID of the style to apply
   */
  const applyStyle = useCallback(async (styleId: string) => {
    if (!editorInstance) {
      console.warn("Cannot apply style - no editor instance available");
      return;
    }
    
    try {
      // Get the style with inheritance applied
      const style = await textStyleStore.getStyleWithInheritance(styleId);
      if (!style) {
        throw new Error(`Style with ID "${styleId}" not found`);
      }
      
      // Check if there is any selected text
      if (editorInstance.state.selection.empty) {
        toast({
          title: "No text selected",
          description: "Please select some text to apply the style",
          variant: "default"
        });
        return;
      }
      
      // Apply styling to the selected text
      editorInstance
        .chain()
        .focus()
        .setFontFamily(style.fontFamily)
        .setFontSize(style.fontSize)
        .setColor(style.color)
        .run();
        
      // Apply font weight via HTML attributes since it's not directly supported
      const { view } = editorInstance;
      const { from, to } = view.state.selection;
      
      // Set data attribute for the selection
      const tr = view.state.tr;
      const styles = {
        'font-weight': style.fontWeight,
        'line-height': style.lineHeight,
        'letter-spacing': style.letterSpacing
      };
      
      // Apply styles via a span with inline style
      tr.addMark(
        from, 
        to, 
        view.state.schema.marks.textStyle.create({
          style: Object.entries(styles)
            .map(([key, value]) => `${key}: ${value}`)
            .join('; ')
        })
      );
      
      view.dispatch(tr);
      
      toast({
        title: "Style applied",
        description: `Applied "${style.name}" to selected text`
      });
      
    } catch (error) {
      console.error("Error applying style:", error);
      toast({
        title: "Error applying style",
        description: "Could not apply the style to the selected text",
        variant: "destructive"
      });
    }
  }, [editorInstance, toast]);

  return { applyStyle };
};
