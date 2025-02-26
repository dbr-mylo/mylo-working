
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const RichTextEditor = ({ content, onUpdate, isEditable = true }) => {
  const editor = useEditor({
    extensions: [StarterKit],
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
    <div className="prose prose-sm max-w-none [&_.ProseMirror]:min-h-[calc(100vh-16rem)] [&_.ProseMirror]:focus:outline-none">
      <style>
        {`
          .ProseMirror ul, .ProseMirror ol {
            margin-top: 0;
            margin-bottom: 0;
            padding-left: 20px;
          }
          .ProseMirror li {
            margin-bottom: 4px;
            line-height: 1.2;
          }
          .ProseMirror li p {
            margin: 0;
          }
        `}
      </style>
      <div className="flex items-center gap-2 mb-4 border-b border-editor-border pb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-accent' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
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
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};
