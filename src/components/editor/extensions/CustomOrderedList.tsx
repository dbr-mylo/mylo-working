
import OrderedList from '@tiptap/extension-ordered-list';

export const CustomOrderedList = OrderedList.extend({
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
