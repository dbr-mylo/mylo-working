
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { FontSize } from './editor/extensions/font-size';
import { LineHeight } from './editor/extensions/line-height';
import { EditorToolbar } from './editor/toolbar/EditorToolbar';

export const RichTextEditor = ({ content, onUpdate, isEditable = true }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      FontSize,
      Color,
      Highlight,
      Subscript,
      Superscript,
      LineHeight,
    ],
    content: content,
    editable: isEditable,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="prose prose-sm max-w-none">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="min-h-[calc(100vh-16rem)] focus:outline-none" />
    </div>
  );
};
