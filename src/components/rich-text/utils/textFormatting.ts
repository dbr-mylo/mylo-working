
import { Editor } from "@tiptap/react";

/**
 * Clears all formatting from the selected text
 */
export const clearFormatting = (editor: Editor) => {
  if (!editor) return;
  
  if (editor.state.selection.empty) {
    // If no selection, inform the user
    console.log("No text selected to clear formatting");
    return;
  }
  
  try {
    editor.chain()
      .focus()
      .unsetAllMarks() // Remove all marks (bold, italic, etc.)
      .unsetFontFamily() // Clear font family
      .unsetColor() // Clear color
      .setFontSize('16px') // Reset font size to default
      .run();
      
    console.log("Formatting cleared");
  } catch (error) {
    console.error("Error clearing formatting:", error);
  }
};
