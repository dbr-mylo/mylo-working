
import { EditorContent } from '@tiptap/react';
import { useEditorSetup } from './rich-text/useEditor';
import { EditorToolbar } from './rich-text/EditorToolbar';
import { EditorStyles } from './rich-text/EditorStyles';

interface RichTextEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  isEditable?: boolean;
  hideToolbar?: boolean;
}

export const RichTextEditor = ({ 
  content, 
  onUpdate, 
  isEditable = true, 
  hideToolbar = false 
}: RichTextEditorProps) => {
  const {
    editor,
    currentFont,
    currentColor,
    handleFontChange,
    handleColorChange
  } = useEditorSetup({ content, onUpdate, isEditable });

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full bg-white">
      <EditorStyles />
      {!hideToolbar && (
        <EditorToolbar 
          editor={editor}
          currentFont={currentFont}
          currentColor={currentColor}
          onFontChange={handleFontChange}
          onColorChange={handleColorChange}
        />
      )}
      <EditorContent 
        editor={editor} 
        className="prose max-w-none"
        style={{
          width: '8.5in',
          minHeight: '11in',
          margin: '0 auto',
          padding: '1in',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
        }}
      />
    </div>
  );
};
