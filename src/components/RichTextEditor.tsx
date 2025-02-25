
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Extension } from '@tiptap/core';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Heading1, Heading2, Heading3, Subscript as SubscriptIcon, 
  Superscript as SuperscriptIcon, Highlighter, Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px'];
const LINE_HEIGHTS = {
  'single': '1',
  '1.5': '1.5',
  'double': '2',
};

const FontSize = TextStyle.extend({
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize }).run();
      },
    };
  },
});

// Custom extension for line height
const LineHeight = Extension.create({
  name: 'lineHeight',
  addAttributes() {
    return {
      lineHeight: {
        default: '1.5',
        parseHTML: element => element.style.lineHeight,
        renderHTML: attributes => {
          if (!attributes.lineHeight) return {};
          return {
            style: `line-height: ${attributes.lineHeight}`,
          };
        },
      },
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading'],
        attributes: {
          lineHeight: {
            default: '1.5',
            parseHTML: element => element.style.lineHeight,
            renderHTML: attributes => {
              if (!attributes.lineHeight) return {};
              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setLineHeight: (lineHeight: string) => ({ chain }) => {
        return chain()
          .setNodes({ lineHeight })
          .run();
      },
    };
  },
});

export const RichTextEditor = ({ content, onUpdate, isEditable = true }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
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

  const formatButtons = [
    {
      icon: <Bold className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      tooltip: 'Bold',
    },
    {
      icon: <Italic className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      tooltip: 'Italic',
    },
    {
      icon: <UnderlineIcon className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
      tooltip: 'Underline',
    },
    {
      icon: <Strikethrough className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
      tooltip: 'Strikethrough',
    },
  ];

  const listButtons = [
    {
      icon: <List className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      tooltip: 'Bullet List',
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      tooltip: 'Numbered List',
    },
  ];

  const alignmentButtons = [
    {
      icon: <AlignLeft className="h-4 w-4" />,
      action: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: editor.isActive({ textAlign: 'left' }),
      tooltip: 'Align Left',
    },
    {
      icon: <AlignCenter className="h-4 w-4" />,
      action: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: editor.isActive({ textAlign: 'center' }),
      tooltip: 'Align Center',
    },
    {
      icon: <AlignRight className="h-4 w-4" />,
      action: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: editor.isActive({ textAlign: 'right' }),
      tooltip: 'Align Right',
    },
    {
      icon: <AlignJustify className="h-4 w-4" />,
      action: () => editor.chain().focus().setTextAlign('justify').run(),
      isActive: editor.isActive({ textAlign: 'justify' }),
      tooltip: 'Justify',
    },
  ];

  const headingButtons = [
    {
      icon: <Heading1 className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
      tooltip: 'Heading 1',
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
      tooltip: 'Heading 2',
    },
    {
      icon: <Heading3 className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
      tooltip: 'Heading 3',
    },
  ];

  const scriptButtons = [
    {
      icon: <SuperscriptIcon className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleSuperscript().run(),
      isActive: editor.isActive('superscript'),
      tooltip: 'Superscript',
    },
    {
      icon: <SubscriptIcon className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleSubscript().run(),
      isActive: editor.isActive('subscript'),
      tooltip: 'Subscript',
    },
  ];

  return (
    <div className="prose prose-sm max-w-none">
      <div className="flex flex-wrap items-center gap-2 mb-4 border-b border-editor-border pb-2">
        <div className="flex items-center gap-1 border-r border-editor-border pr-2">
          {formatButtons.map((button, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={button.action}
              className={button.isActive ? 'bg-accent' : ''}
              title={button.tooltip}
            >
              {button.icon}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-1 border-r border-editor-border pr-2">
          {listButtons.map((button, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={button.action}
              className={button.isActive ? 'bg-accent' : ''}
              title={button.tooltip}
            >
              {button.icon}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-1 border-r border-editor-border pr-2">
          {alignmentButtons.map((button, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={button.action}
              className={button.isActive ? 'bg-accent' : ''}
              title={button.tooltip}
            >
              {button.icon}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-1 border-r border-editor-border pr-2">
          {headingButtons.map((button, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={button.action}
              className={button.isActive ? 'bg-accent' : ''}
              title={button.tooltip}
            >
              {button.icon}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-1 border-r border-editor-border pr-2">
          <select
            className="h-9 rounded-md px-3 text-sm border border-input bg-background"
            onChange={(e) => {
              editor.chain().focus().setFontSize(e.target.value).run();
            }}
          >
            <option value="">Font Size</option>
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <select
            className="h-9 rounded-md px-3 text-sm border border-input bg-background"
            onChange={(e) => {
              editor.chain().focus().setLineHeight(e.target.value).run();
            }}
          >
            <option value="">Line Height</option>
            {Object.entries(LINE_HEIGHTS).map(([name, value]) => (
              <option key={value} value={value}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          {scriptButtons.map((button, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={button.action}
              className={button.isActive ? 'bg-accent' : ''}
              title={button.tooltip}
            >
              {button.icon}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const color = window.prompt('Enter highlight color (e.g., #ffeb3b):');
              if (color) {
                editor.chain().focus().setHighlight({ color }).run();
              }
            }}
            className={editor.isActive('highlight') ? 'bg-accent' : ''}
            title="Highlight"
          >
            <Highlighter className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const color = window.prompt('Enter text color (e.g., #ff0000):');
              if (color) {
                editor.chain().focus().setColor(color).run();
              }
            }}
            className={editor.isActive('textStyle') ? 'bg-accent' : ''}
            title="Text Color"
          >
            <Palette className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <EditorContent editor={editor} className="min-h-[calc(100vh-16rem)] focus:outline-none" />
    </div>
  );
};
