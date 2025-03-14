
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
      .setFontFamily('Inter') // Reset font family to default
      .setColor('#000000') // Reset color to default
      .setFontSize('16px') // Reset font size to default
      .setTextAlign('left') // Reset text alignment
      .run();
      
    console.log("Formatting cleared");
  } catch (error) {
    console.error("Error clearing formatting:", error);
  }
};
