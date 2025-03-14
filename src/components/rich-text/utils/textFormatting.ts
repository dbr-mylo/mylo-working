
import { Editor } from "@tiptap/react";
import { CLEAR_FONT_CACHE_EVENT } from "../font-size/constants";

/**
 * Clears all formatting from the selected text
 * 
 * This function completely removes all formatting applied to the selected text:
 * - Bold, italic, underline, strikethrough
 * - Custom font family
 * - Custom text color
 * - Custom font size
 * - Text alignment
 * - Indentation
 * - List formatting
 */
export const clearFormatting = (editor: Editor) => {
  if (!editor) return;
  
  if (editor.state.selection.empty) {
    // If no selection, inform the user that text must be selected first
    console.log("No text selected to clear formatting");
    return;
  }
  
  try {
    console.log("Clearing formatting for selection");
    
    // First, capture the current selection to maintain it
    const { from, to } = editor.state.selection;
    
    // Start a chained transaction to batch all clear operations together
    const chain = editor.chain().focus();
    
    // Clear formatting using a multi-step approach
    
    // 1. Remove all marks (bold, italic, etc.)
    chain.unsetAllMarks();
    
    // 2. Clear font family to default
    chain.setFontFamily('Inter');
    
    // 3. Clear color to default
    chain.setColor('#000000');
    
    // 4. Clear custom font size
    chain.setFontSize('16px');
    
    // 5. Reset text alignment if the extension is available
    // Check if the setTextAlign method exists before calling it
    if (typeof chain.setTextAlign === 'function') {
      chain.setTextAlign('left');
    }
    
    // 6. Lift the selection out of lists, if in a list
    // This removes bullet points and numbering
    if (editor.isActive('bulletList') || editor.isActive('orderedList')) {
      chain.liftListItem('listItem');
    }
    
    // 7. Reset any indentation by explicitly setting indent to 0
    // For paragraphs
    chain.updateAttributes('paragraph', { indent: 0 });
    // For lists (in case they weren't lifted)
    chain.updateAttributes('bulletList', { indent: 0 });
    chain.updateAttributes('orderedList', { indent: 0 });
    
    // Execute all the commands at once
    chain.run();
    
    // Forcefully reapply the selection to ensure it's maintained
    editor.commands.setTextSelection({ from, to });
    
    // Trigger the font cache clear event to ensure font sizes are properly refreshed
    document.dispatchEvent(new CustomEvent(CLEAR_FONT_CACHE_EVENT));
    
    // Log successful clearing
    console.log("Formatting cleared successfully - first pass");
    
    // Final check to ensure all formatting is cleared
    // Sometimes we need to reapply the default values after unsetAllMarks
    setTimeout(() => {
      editor.chain()
        .focus()
        .setFontFamily('Inter')
        .setColor('#000000')
        .setFontSize('16px')
        .run();
      
      // Trigger the event again to ensure UI is updated
      document.dispatchEvent(new CustomEvent(CLEAR_FONT_CACHE_EVENT));
      
      console.log("Formatting cleared successfully - second pass");
    }, 10);
    
  } catch (error) {
    console.error("Error clearing formatting:", error);
  }
};

/**
 * Resets specific formatting while preserving others
 * 
 * @param editor The editor instance
 * @param options Configuration of what to reset
 */
export const resetSpecificFormatting = (
  editor: Editor, 
  options = {
    marks: true,
    fontFamily: true,
    fontSize: true,
    color: true,
    alignment: true,
    lists: false,
    indent: false
  }
) => {
  if (!editor) return;
  
  if (editor.state.selection.empty) {
    console.log("No text selected to reset formatting");
    return;
  }
  
  try {
    const chain = editor.chain().focus();
    
    if (options.marks) {
      chain.unsetAllMarks();
    }
    
    if (options.fontFamily) {
      chain.setFontFamily('Inter');
    }
    
    if (options.color) {
      chain.setColor('#000000');
    }
    
    if (options.fontSize) {
      chain.setFontSize('16px');
    }
    
    if (options.alignment && typeof chain.setTextAlign === 'function') {
      chain.setTextAlign('left');
    }
    
    if (options.lists) {
      if (editor.isActive('bulletList') || editor.isActive('orderedList')) {
        chain.liftListItem('listItem');
      }
    }
    
    if (options.indent) {
      chain.updateAttributes('paragraph', { indent: 0 });
      chain.updateAttributes('bulletList', { indent: 0 });
      chain.updateAttributes('orderedList', { indent: 0 });
    }
    
    // Execute all commands
    chain.run();
    
    // Trigger the font cache clear event to ensure refreshed view
    document.dispatchEvent(new CustomEvent(CLEAR_FONT_CACHE_EVENT));
    
    console.log("Specific formatting reset");
  } catch (error) {
    console.error("Error resetting specific formatting:", error);
  }
};
