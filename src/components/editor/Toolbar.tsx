
import React from 'react';
import { Editor } from '@tiptap/react';
import { useAuth } from '@/contexts/AuthContext';
import { EditorToolbar } from './toolbar/EditorToolbar';
import { FormatButtonGroup } from './toolbar/FormatButtonGroup'; 
import { ListButtonGroup } from './toolbar/ListButtonGroup';
import { AlignmentButtonGroup } from './toolbar/AlignmentButtonGroup';
import { IndentButtonGroup } from './toolbar/IndentButtonGroup';
import { ClearFormattingButton } from './toolbar/ClearFormattingButton';
import { TextControls } from './toolbar/TextControls';

interface ToolbarProps {
  editor: Editor;
}

export const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  const { role } = useAuth();
  
  if (!editor) {
    return null;
  }

  // If user is in editor role, use the editor-specific toolbar
  if (role === 'editor') {
    return <EditorToolbar editor={editor} />;
  }
  
  // For designer role or other roles, use the original toolbar
  const currentColor = editor.getAttributes('textStyle').color || '#000000';
  
  return (
    <div className="rounded-md bg-background p-1 flex flex-wrap gap-3 items-center">
      {/* Text styling controls - font family, font size and color */}
      <TextControls editor={editor} />
      
      {/* Text formatting buttons - bold and italic */}
      <FormatButtonGroup editor={editor} currentColor={currentColor} />

      {/* List buttons - bullet and ordered lists */}
      <ListButtonGroup editor={editor} currentColor={currentColor} />
      
      {/* Text alignment buttons */}
      <AlignmentButtonGroup editor={editor} />
      
      {/* Indentation controls */}
      <IndentButtonGroup editor={editor} />
      
      {/* Clear formatting button */}
      <ClearFormattingButton editor={editor} />
    </div>
  );
};
