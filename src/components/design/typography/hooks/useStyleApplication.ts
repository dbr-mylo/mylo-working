
import { Editor } from "@tiptap/react";
import { TextStyle } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export const useStyleApplication = (
  editorInstance: Editor | null | undefined,  
  onEditStyle: (style: TextStyle) => void
) => {
  const { toast } = useToast();

  const handleStyleClick = async (style: TextStyle) => {
    console.log("Style clicked in sidebar:", style.name);
    
    if (style.id === 'default-text-reset') {
      console.log("Applying default text formatting");
      await applyDefaultTextStyle();
      return;
    }
    
    console.log("Editor has selection:", editorInstance && !editorInstance.state.selection.empty);
    
    if (editorInstance && !editorInstance.state.selection.empty) {
      try {
        console.log("Applying style to selection:", style.id);
        await applyStyleToSelection(style.id);
        toast({
          title: "Style applied",
          description: `Applied "${style.name}" to selected text`
        });
      } catch (error) {
        console.error("Error applying style from sidebar:", error);
        toast({
          title: "Error applying style",
          description: "Could not apply the style to the selected text",
          variant: "destructive"
        });
      }
    } else {
      if (!style.isPersistent) {
        console.log("No selection or no editor, opening style editor");
        onEditStyle(style);
      } else if (editorInstance) {
        toast({
          title: "No text selected",
          description: "Please select some text to apply the default style"
        });
      }
    }
  };

  return {
    handleStyleClick
  };
};
