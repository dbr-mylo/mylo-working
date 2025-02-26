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
      Tab: ({ editor }) => {
        // Create new nested bullet if we're on an empty line
        if (editor.isActive('listItem') && editor.state.selection.empty && editor.state.doc.textBetween(editor.state.selection.from - 1, editor.state.selection.from) === '') {
          return editor.commands.sinkListItem('listItem');
        }
        // Otherwise just indent the existing bullet
        if (editor.isActive('bulletList')) {
          return editor.commands.sinkListItem('listItem');
        }
        return false;
      },
      'Shift-Tab': ({ editor }) => {
        if (editor.isActive('bulletList')) {
          return editor.commands.liftListItem('listItem');
        }
        return false;
      },
    }
  },
});

const CustomOrderedList = OrderedList.extend({
  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        // Create new nested bullet if we're on an empty line
        if (editor.isActive('listItem') && editor.state.selection.empty && editor.state.doc.textBetween(editor.state.selection.from - 1, editor.state.selection.from) === '') {
          return editor.commands.sinkListItem('listItem');
        }
        // Otherwise just indent the existing bullet
        if (editor.isActive('orderedList')) {
          return editor.commands.sinkListItem('listItem');
        }
        return false;
      },
      'Shift-Tab': ({ editor }) => {
        if (editor.isActive('orderedList')) {
          return editor.commands.liftListItem('listItem');
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
      }),
      ListItem,
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
