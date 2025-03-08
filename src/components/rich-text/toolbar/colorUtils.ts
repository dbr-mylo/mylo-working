
import { Editor } from '@tiptap/react';

export const handleBoldClick = (editor: Editor | null, currentColor: string) => {
  if (!editor) return;
  
  // Get current color before toggling bold
  const { color } = editor.getAttributes('textStyle');
  const currentColorValue = color || currentColor;
  
  console.log("Bold toggle - Before:", { 
    currentColor: currentColorValue, 
    isBoldActive: editor.isActive('bold'),
    selection: editor.state.selection.content().content.size > 0 ? "Has selection" : "No selection",
    selectionHTML: editor.getHTML().substring(0, 100) 
  });
  
  // Toggle bold formatting
  editor.chain().focus().toggleBold().run();
  
  // Immediately apply color to ensure it sticks after toggling bold
  editor.chain().focus().setColor(currentColorValue).run();
  
  console.log("Bold toggle - Color applied:", currentColorValue);
  
  // Apply color again with a slight delay to ensure it overrides any default styling
  setTimeout(() => {
    if (editor.isActive('bold')) {
      editor.chain().focus().setColor(currentColorValue).run();
      console.log("Bold toggle - Color reapplied after delay:", currentColorValue);
    }
  }, 10);
  
  // And one more time with a longer delay as a fallback
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

export const preserveColorAfterFormatting = (editor: Editor | null, currentColor: string, formatCommand: () => void) => {
  if (!editor) return;
  
  // Store current color and selection state before formatting
  const { color } = editor.getAttributes('textStyle');
  const colorToPreserve = color || currentColor;
  const htmlBefore = editor.getHTML();
  
  console.log("Formatting - Before:", { 
    colorToPreserve, 
    selectionHtml: htmlBefore.substring(0, 100)
  });
  
  // Execute the formatting command
  formatCommand();
  
  // Immediately apply the color to the formatted text
  editor.chain().focus().setColor(colorToPreserve).run();
  
  console.log("Formatting - Color applied:", colorToPreserve);
  
  // Apply color again with a delay to ensure it sticks
  setTimeout(() => {
    editor.chain().focus().setColor(colorToPreserve).run();
    console.log("Formatting - Color reapplied after delay:", colorToPreserve);
  }, 10);
  
  // One more application with a longer delay as a fallback
  setTimeout(() => {
    editor.chain().focus().setColor(colorToPreserve).run();
    console.log("Formatting - Final color application:", colorToPreserve);
  }, 50);
  
  console.log("Formatting - After:", { 
    colorApplied: colorToPreserve,
    htmlAfter: editor.getHTML().substring(0, 100)
  });
};
