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
    
    console.log("Before bold toggle - Current color:", currentColorValue);
    console.log("Is bold active before toggle:", editor.isActive('bold'));
    
    editor.chain().focus().toggleBold().run();
    
    console.log("After bold toggle - Is bold active:", editor.isActive('bold'));
    
    setTimeout(() => {
      editor.chain().focus().setColor(currentColorValue).run();
      console.log("Color reapplied after bold toggle:", currentColorValue);
    }, 0);
  };

  const preserveColorAfterFormatting = (formatCommand: () => void) => {
    if (!editor) return;
    
    const { color } = editor.getAttributes('textStyle');
    const colorToPreserve = color || currentColor;
    console.log("Preserving color for formatting:", colorToPreserve);
    
    formatCommand();
    
    setTimeout(() => {
      editor.chain().focus().setColor(colorToPreserve).run();
      console.log("Color reapplied after formatting:", colorToPreserve);
    }, 0);
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
        size="sm"
        onClick={handleBoldClick}
        className={editor.isActive('bold') ? 'bg-accent' : ''}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
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
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-accent' : ''}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-accent' : ''}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleIndent}
        title="Indent paragraph"
      >
        <Indent className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleOutdent}
        title="Outdent paragraph"
      >
        <Outdent className="h-4 w-4" />
      </Button>
    </div>
  );
};
