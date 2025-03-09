
import { useCallback } from "react";
import { Editor } from "@tiptap/react";

/**
 * Hook for handling text alignment in the editor.
 * Uses the TextAlign extension that has been added to the editor.
 */
export const useTextAlignment = (editor: Editor | null) => {
  const setTextAlign = useCallback((alignment: "left" | "center" | "right" | "justify") => {
    if (!editor) return false;
    
    try {
      switch (alignment) {
        case 'left':
          editor.chain().focus().setTextAlign('left').run();
          break;
        case 'center':
          editor.chain().focus().setTextAlign('center').run();
          break;
        case 'right':
          editor.chain().focus().setTextAlign('right').run();
          break;
        case 'justify':
          editor.chain().focus().setTextAlign('justify').run();
          break;
      }
      return true;
    } catch (error) {
      console.error("Error setting text alignment:", error);
      return false;
    }
  }, [editor]);

  return { setTextAlign };
};
