
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CustomBulletList = BulletList.extend({
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (this.editor.isActive('bulletList')) {
          // Force indent the list item regardless of parent existence
          this.editor.commands.sinkListItem('listItem');
          return true;
        }
        return false;
      },
      'Shift-Tab': () => {
        if (this.editor.isActive('bulletList')) {
          this.editor.commands.liftListItem('listItem');
          return true;
        }
        return false;
      },
    }
  },
});

const CustomOrderedList = OrderedList.extend({
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (this.editor.isActive('orderedList')) {
          // Force indent the list item regardless of parent existence
          this.editor.commands.sinkListItem('listItem');
          return true;
        }
        return false;
      },
      'Shift-Tab': () => {
        if (this.editor.isActive('orderedList')) {
          this.editor.commands.liftListItem('listItem');
          return true;
        }
        return false;
      },
    }
  },
});

export const RichTextEditor = ({ content, onUpdate, isEditable = true }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      ListItem.configure({
        keepMarks: true,
        keepAttributes: true,
      }),
      CustomBulletList,
      CustomOrderedList,
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
          .ProseMirror ul ul, .ProseMirror ol ol, .ProseMirror ul ol, .ProseMirror ol ul {
            margin-top: 4px;
          }
          .ProseMirror li > ul, .ProseMirror li > ol {
            padding-left: 24px;
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-accent' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};
