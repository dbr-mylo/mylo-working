
import React from 'react';
import { Editor } from '@tiptap/react';
import { TextControls } from './toolbar/TextControls';
import { WriterFormatButtonGroup } from '@/components/toolbar/writer/WriterFormatButtonGroup';
import { WriterListButtonGroup } from '@/components/toolbar/writer/WriterListButtonGroup';
import { WriterAlignmentButtonGroup } from '@/components/toolbar/writer/WriterAlignmentButtonGroup';
import { WriterIndentButtonGroup } from '@/components/toolbar/writer/WriterIndentButtonGroup';
import { WriterClearFormattingButton } from '@/components/toolbar/writer/WriterClearFormattingButton';

interface ToolbarProps {
  editor: Editor;
}

export const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  if (!editor) {
    console.log("Toolbar render skipped: No editor instance");
    return null;
  }

  const currentColor = editor.getAttributes('textStyle').color || '#000000';
  
  return (
    <div className="rounded-md bg-background p-1 flex flex-wrap gap-3 items-center">
      {/* Text styling controls - font family, font size and color */}
      <TextControls editor={editor} />
      
      {/* Text formatting buttons - bold and italic */}
      <WriterFormatButtonGroup editor={editor} currentColor={currentColor} />

      {/* List buttons - bullet and ordered lists */}
      <WriterListButtonGroup editor={editor} currentColor={currentColor} />
      
      {/* Text alignment buttons */}
      <WriterAlignmentButtonGroup editor={editor} />
      
      {/* Indentation controls */}
      <WriterIndentButtonGroup editor={editor} />
      
      {/* Clear formatting button */}
      <WriterClearFormattingButton editor={editor} />
    </div>
  );
};
