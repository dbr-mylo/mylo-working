
import React, { useEffect } from 'react';
import { EditorContent, useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Color from '@tiptap/extension-color';
import { Toolbar } from './editor/Toolbar';
import { ColorPreservationStyles } from './rich-text/styles/ColorPreservationStyles';

interface RichTextEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  isEditable?: boolean;
  hideToolbar?: boolean;
  renderToolbarOutside?: boolean;
  externalToolbar?: boolean;
  externalEditorInstance?: Editor | null;
}

export const RichTextEditor = ({
  content,
  onUpdate,
  isEditable = true,
  hideToolbar = false,
  renderToolbarOutside = false,
  externalToolbar = false,
  externalEditorInstance = null,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        textAlign: {
          types: ['heading', 'paragraph'],
        },
      }),
      TextStyle,
      FontFamily,
      Color,
    ],
    content,
    editable: isEditable,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  // Update content from props when it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Use external editor instance if provided
  const activeEditor = externalEditorInstance || editor;

  if (!activeEditor) {
    return null;
  }

  return (
    <div className="rich-text-editor">
      {/* Include the color preservation styles */}
      <ColorPreservationStyles />
      
      {!hideToolbar && isEditable && !externalToolbar && (
        <Toolbar editor={activeEditor} />
      )}
      <EditorContent editor={activeEditor} className="prose prose-sm max-w-none p-4" />
    </div>
  );
};
