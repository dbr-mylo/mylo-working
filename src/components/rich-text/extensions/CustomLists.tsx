
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';

// Export the ListItem extension to make sure we have only one instance
export const CustomListItem = ListItem.configure({
  HTMLAttributes: {
    class: 'custom-list-item',
  },
});

export const CustomBulletList = BulletList.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'custom-bullet-list',
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
    };
  },
});

export const CustomOrderedList = OrderedList.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'custom-ordered-list',
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
    };
  },
});
