
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';

export const CustomBulletList = BulletList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      indent: {
        default: 0,
        parseHTML: element => {
          return parseInt(element.getAttribute('data-indent') || '0', 10);
        },
        renderHTML: attributes => {
          if (!attributes.indent) {
            return {};
          }
          
          return {
            'data-indent': attributes.indent,
            style: `padding-left: ${attributes.indent * 2}em`,
          };
        },
      },
    };
  },
  
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

export const CustomOrderedList = OrderedList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      indent: {
        default: 0,
        parseHTML: element => {
          return parseInt(element.getAttribute('data-indent') || '0', 10);
        },
        renderHTML: attributes => {
          if (!attributes.indent) {
            return {};
          }
          
          return {
            'data-indent': attributes.indent,
            style: `padding-left: ${attributes.indent * 2}em`,
          };
        },
      },
    };
  },
  
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
