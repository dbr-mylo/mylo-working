
import { useState, useEffect, useCallback } from "react";
import { Editor } from "@tiptap/react";
import { textStyleStore } from "@/stores/textStyles";
import { TextStyle } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface UseStyleApplicationProps {
  editor: Editor | null;
}

export const useStyleApplication = (editor: Editor | null) => {
  const [styles, setStyles] = useState<TextStyle[]>([]);
  const { toast } = useToast();
  
  // Load text styles
  useEffect(() => {
    const loadStyles = async () => {
      try {
        const textStyles = await textStyleStore.getTextStyles();
        setStyles(textStyles);
      } catch (error) {
        console.error("Error loading text styles:", error);
      }
    };
    
    loadStyles();
  }, []);
  
  // Apply style to editor
  const applyStyle = useCallback(async (styleId: string) => {
    if (!editor) {
      console.warn("No editor instance available to apply style");
      return;
    }
    
    try {
      // Get the style with all inherited properties
      const style = await textStyleStore.getStyleWithInheritance(styleId);
      
      if (!style) {
        console.error("Style not found:", styleId);
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
      console.error("Error applying style:", error);
      toast({
        title: "Could not apply style",
        description: "An error occurred while applying the style",
        variant: "destructive"
      });
    }
  }, [editor, toast]);
  
  return { styles, applyStyle };
};
