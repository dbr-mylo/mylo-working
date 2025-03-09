
import { Editor } from '@tiptap/react';

/**
 * Preserves text color when applying formatting commands
 * 
 * @param editor The TipTap editor instance
 * @param formatCommand The formatting function to execute
 * @param currentColor Current color to preserve
 */
export const preserveColorAfterFormatting = (
  editor: Editor,
  formatCommand: () => void,
  currentColor: string
) => {
  if (!editor) return;
  
  const { color } = editor.getAttributes('textStyle');
  const colorToPreserve = color || currentColor;
  const htmlBefore = editor.getHTML();
  
  console.log("Formatting - Before:", { 
    colorToPreserve, 
    selectionHtml: htmlBefore.substring(0, 100)
  });
  
  formatCommand();
  
  editor.chain().focus().setColor(colorToPreserve).run();
  
  console.log("Formatting - Color applied:", colorToPreserve);
  
  setTimeout(() => {
    editor.chain().focus().setColor(colorToPreserve).run();
    console.log("Formatting - Color reapplied after delay:", colorToPreserve);
  }, 10);
  
  setTimeout(() => {
    editor.chain().focus().setColor(colorToPreserve).run();
    console.log("Formatting - Final color application:", colorToPreserve);
  }, 50);
  
  console.log("Formatting - After:", { 
    colorApplied: colorToPreserve,
    htmlAfter: editor.getHTML().substring(0, 100)
  });
};

/**
 * Handle bold formatting with color preservation
 */
export const handleBoldWithColorPreservation = (editor: Editor, currentColor: string) => {
  if (!editor) return;
  
  const { color } = editor.getAttributes('textStyle');
  const currentColorValue = color || currentColor;
  
  console.log("Bold toggle - Before:", { 
    currentColor: currentColorValue, 
    isBoldActive: editor.isActive('bold'),
    selection: editor.state.selection.content().content.size > 0 ? "Has selection" : "No selection",
    selectionHTML: editor.getHTML().substring(0, 100) 
  });
  
  editor.chain().focus().toggleBold().run();
  editor.chain().focus().setColor(currentColorValue).run();
  
  console.log("Bold toggle - Color applied:", currentColorValue);
  
  setTimeout(() => {
    if (editor.isActive('bold')) {
      editor.chain().focus().setColor(currentColorValue).run();
      console.log("Bold toggle - Color reapplied after delay:", currentColorValue);
    }
  }, 10);
  
  setTimeout(() => {
    if (editor.isActive('bold')) {
      editor.chain().focus().setColor(currentColorValue).run();
      console.log("Bold toggle - Final color reapplication:", currentColorValue);
    }
  }, 50);
  
  console.log("Bold toggle - After:", { 
    currentColor: currentColorValue, 
    isBoldActive: editor.isActive('bold'),
    selectionHTML: editor.getHTML().substring(0, 100)
  });
};
