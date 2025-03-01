
import StarterKit from '@tiptap/starter-kit';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { CustomBulletList } from './extensions/CustomBulletList';
import { CustomOrderedList } from './extensions/CustomOrderedList';
import { IndentExtension } from './extensions/IndentExtension';
import { FontFamily } from './extensions/FontFamily';

export const getEditorExtensions = () => [
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
];
