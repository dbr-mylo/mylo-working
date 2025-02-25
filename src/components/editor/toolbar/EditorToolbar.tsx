
import { Editor } from '@tiptap/react';
import { FormatButtons } from './sections/FormatButtons';
import { ListButtons } from './sections/ListButtons';
import { AlignmentButtons } from './sections/AlignmentButtons';
import { HeadingButtons } from './sections/HeadingButtons';
import { TextSizeControls } from './sections/TextSizeControls';
import { TextStyleButtons } from './sections/TextStyleButtons';

interface EditorToolbarProps {
  editor: Editor;
}

export const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 border-b border-editor-border pb-2">
      <FormatButtons editor={editor} />
      <ListButtons editor={editor} />
      <AlignmentButtons editor={editor} />
      <HeadingButtons editor={editor} />
      <TextSizeControls editor={editor} />
      <TextStyleButtons editor={editor} />
    </div>
  );
};
