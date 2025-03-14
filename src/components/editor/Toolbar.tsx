
import React from 'react';
import { Editor } from '@tiptap/react';
import { useToast } from '@/hooks/use-toast';
import { TextControls } from './toolbar/TextControls';
import { FormatButtonGroup } from './toolbar/FormatButtonGroup';
import { ListButtonGroup } from './toolbar/ListButtonGroup';
import { AlignmentButtonGroup } from './toolbar/AlignmentButtonGroup';
import { IndentButtonGroup } from './toolbar/IndentButtonGroup';
import { ClearFormattingButton } from './toolbar/ClearFormattingButton';
import { FontSizeInput } from '../rich-text/font-size';
import { useAuth } from '@/contexts/AuthContext';

interface ToolbarProps {
  editor: Editor;
}

export const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  const { toast } = useToast();
  const { role } = useAuth();
  const isDesigner = role === "designer";
  
  if (!editor) {
    return null;
  }

  const currentColor = editor.getAttributes('textStyle').color || '#000000';
  const currentFontSize = editor.getAttributes('textStyle').fontSize || '16px';

  return (
    <div className="rounded-md bg-background p-1 flex flex-wrap gap-1 items-center">
      {/* Text styling controls - font family and color */}
      <TextControls editor={editor} />
      
      {/* Font size control - only visible for designer role */}
      {isDesigner && (
        <FontSizeInput 
          value={currentFontSize} 
          onChange={(fontSize) => {
            editor.chain().focus().setFontSize(fontSize).run();
          }}
          className="ml-1 mr-1"
        />
      )}
      
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
