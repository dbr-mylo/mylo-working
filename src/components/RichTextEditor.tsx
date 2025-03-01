import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Bold, Italic, List, ListOrdered, Indent, Outdent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { FontPicker } from './FontPicker';
import { ColorPicker } from './ColorPicker';

const CustomBulletList = BulletList.extend({
  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        if (editor.isActive('bulletList')) {
          if (editor.isActive('listItem') && editor.state.selection.empty && editor.state.doc.textBetween(editor.state.selection.from - 1, editor.state.selection.from) === '') {
            editor.commands.sinkListItem('listItem');
            return true;
          }
          editor.commands.sinkListItem('listItem');
          return true;
        }
        return false;
      },
      'Shift-Tab': ({ editor }) => {
        if (editor.isActive('bulletList')) {
          editor.commands.liftListItem('listItem');
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
      Tab: ({ editor }) => {
        if (editor.isActive('orderedList')) {
          if (editor.isActive('listItem') && editor.state.selection.empty && editor.state.doc.textBetween(editor.state.selection.from - 1, editor.state.selection.from) === '') {
            editor.commands.sinkListItem('listItem');
            return true;
          }
          editor.commands.sinkListItem('listItem');
          return true;
        }
        return false;
      },
      'Shift-Tab': ({ editor }) => {
        if (editor.isActive('orderedList')) {
          editor.commands.liftListItem('listItem');
          return true;
        }
        return false;
      },
    }
  },
});

const IndentExtension = Extension.create({
  name: 'indent',
  
  addAttributes() {
    return {
      indent: {
        default: 0,
        renderHTML: attributes => {
          if (attributes.indent === 0) return {}
          return {
            style: `margin-left: ${attributes.indent}em;`,
          }
        },
        parseHTML: element => {
          const indent = element.style.marginLeft
          if (!indent) return 0
          const value = parseInt(indent.match(/(\d+)/)?.[1] || '0', 10)
          return value || 0
        },
      },
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading'],
        attributes: {
          indent: {
            default: 0,
            renderHTML: attributes => {
              if (attributes.indent === 0) return {}
              return {
                style: `margin-left: ${attributes.indent}em;`,
              }
            },
            parseHTML: element => {
              const indent = element.style.marginLeft
              if (!indent) return 0
              const value = parseInt(indent.match(/(\d+)/)?.[1] || '0', 10)
              return value || 0
            },
          },
        },
      },
    ]
  },
});

const FontFamily = Extension.create({
  name: 'fontFamily',
  
  addAttributes() {
    return {
      fontFamily: {
        default: 'Inter',
        parseHTML: element => element.style.fontFamily?.replace(/['"]/g, ''),
        renderHTML: attributes => {
          if (!attributes.fontFamily) return {};
          return {
            style: `font-family: ${attributes.fontFamily}`,
          };
        },
      },
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontFamily: {
            default: 'Inter',
            parseHTML: element => element.style.fontFamily?.replace(/['"]/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontFamily) return {};
              return {
                style: `font-family: ${attributes.fontFamily}`,
              };
            },
          },
        },
      },
    ];
  },
});

export const RichTextEditor = ({ content, onUpdate, isEditable = true }) => {
  const [currentFont, setCurrentFont] = useState('Inter');
  const [currentColor, setCurrentColor] = useState('#000000');
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
      }),
      TextStyle,
      FontFamily,
      ListItem,
      CustomBulletList,
      CustomOrderedList,
      Color,
      IndentExtension,
    ],
    content: content,
    editable: isEditable,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && currentFont) {
      editor.chain().focus().setMark('textStyle', { fontFamily: currentFont }).run();
    }
  }, [currentFont, editor]);

  useEffect(() => {
    if (editor && currentColor) {
      editor.chain().focus().setColor(currentColor).run();
    }
  }, [currentColor, editor]);

  const handleFontChange = (font: string) => {
    setCurrentFont(font);
    editor.chain().focus().setMark('textStyle', { fontFamily: font }).run();
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    editor.chain().focus().setColor(color).run();
  };

  const handleIndent = () => {
    if (editor) {
      editor.chain().focus().updateAttributes('paragraph', { 
        indent: Math.min((editor.getAttributes('paragraph').indent || 0) + 1, 10)
      }).run();
    }
  };

  const handleOutdent = () => {
    if (editor) {
      editor.chain().focus().updateAttributes('paragraph', { 
        indent: Math.max((editor.getAttributes('paragraph').indent || 0) - 1, 0)
      }).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="prose prose-sm max-w-none">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@400;700&family=Roboto:wght@400;700&family=Montserrat:wght@400;700&family=Open+Sans:wght@400;700&family=Lato:wght@400;700&family=Poppins:wght@400;700&family=Merriweather:wght@400;700&family=Source+Sans+Pro:wght@400;700&display=swap');
          
          .ProseMirror {
            min-height: 11in;
            width: 8.5in;
            padding: 1in;
            margin: 0 auto;
            background-color: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            overflow-y: auto;
          }
          .ProseMirror:focus {
            outline: none;
          }
          .ProseMirror p {
            margin-top: 0;
            margin-bottom: 4px;
            line-height: 1.2;
          }
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
        <FontPicker value={currentFont} onChange={handleFontChange} />
        <ColorPicker value={currentColor} onChange={handleColorChange} />
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
      <EditorContent editor={editor} />
    </div>
  );
};
