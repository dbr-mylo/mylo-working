import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, List, ListOrdered, Indent, Outdent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FontPicker } from './FontPicker';
import { ColorPicker } from './ColorPicker';
import { useAuth } from '@/contexts/AuthContext';

interface EditorToolbarProps {
  editor: Editor | null;
  currentFont: string;
  currentColor: string;
  onFontChange: (font: string) => void;
  onColorChange: (color: string) => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  currentFont,
  currentColor,
  onFontChange,
  onColorChange
}) => {
  const { role } = useAuth();
  const isDesigner = role === "designer";
  const buttonSize = isDesigner ? "xxs" : "sm";
  
  if (!editor) {
    return null;
  }

  const handleFontChange = (font: string) => {
    onFontChange(font);
  };

  const handleBoldClick = () => {
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

  const preserveColorAfterFormatting = (formatCommand: () => void) => {
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

  const handleIndent = () => {
    if (editor) {
      if (editor.isActive('bulletList')) {
        editor.chain().focus().updateAttributes('bulletList', { 
          indent: Math.min((editor.getAttributes('bulletList').indent || 0) + 1, 10)
        }).run();
      } else if (editor.isActive('orderedList')) {
        editor.chain().focus().updateAttributes('orderedList', { 
          indent: Math.min((editor.getAttributes('orderedList').indent || 0) + 1, 10)
        }).run();
      } else {
        editor.chain().focus().updateAttributes('paragraph', { 
          indent: Math.min((editor.getAttributes('paragraph').indent || 0) + 1, 10)
        }).run();
      }
    }
  };

  const handleOutdent = () => {
    if (editor) {
      if (editor.isActive('bulletList')) {
        editor.chain().focus().updateAttributes('bulletList', { 
          indent: Math.max((editor.getAttributes('bulletList').indent || 0) - 1, 0)
        }).run();
      } else if (editor.isActive('orderedList')) {
        editor.chain().focus().updateAttributes('orderedList', { 
          indent: Math.max((editor.getAttributes('orderedList').indent || 0) - 1, 0)
        }).run();
      } else {
        editor.chain().focus().updateAttributes('paragraph', { 
          indent: Math.max((editor.getAttributes('paragraph').indent || 0) - 1, 0)
        }).run();
      }
    }
  };

  return (
    <div className="flex items-center gap-2 py-2 px-4 border-b border-editor-border bg-white">
      <FontPicker value={currentFont} onChange={handleFontChange} />
      <ColorPicker value={currentColor} onChange={onColorChange} />
      <Button
        variant="outline"
        size={buttonSize}
        onClick={handleBoldClick}
        className={editor.isActive('bold') ? 'bg-accent' : ''}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size={buttonSize}
        onClick={() => {
          preserveColorAfterFormatting(() => {
            editor.chain().focus().toggleItalic().run();
          });
        }}
        className={editor.isActive('italic') ? 'bg-accent' : ''}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size={buttonSize}
        onClick={() => preserveColorAfterFormatting(() => editor.chain().focus().toggleBulletList().run())}
        className={editor.isActive('bulletList') ? 'bg-accent' : ''}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size={buttonSize}
        onClick={() => preserveColorAfterFormatting(() => editor.chain().focus().toggleOrderedList().run())}
        className={editor.isActive('orderedList') ? 'bg-accent' : ''}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size={buttonSize}
        onClick={handleIndent}
        title="Indent paragraph"
      >
        <Indent className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size={buttonSize}
        onClick={handleOutdent}
        title="Outdent paragraph"
      >
        <Outdent className="h-4 w-4" />
      </Button>
    </div>
  );
};
