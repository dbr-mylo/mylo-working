
import React, { useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { useToast } from '@/hooks/use-toast';
import { TextControls } from './toolbar/TextControls';
import { FormatButtonGroup } from './toolbar/FormatButtonGroup';
import { ListButtonGroup } from './toolbar/ListButtonGroup';
import { AlignmentButtonGroup } from './toolbar/AlignmentButtonGroup';
import { IndentButtonGroup } from './toolbar/IndentButtonGroup';
import { ClearFormattingButton } from './toolbar/ClearFormattingButton';

interface ToolbarProps {
  editor: Editor;
}

export const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  const { toast } = useToast();
  
  // Initialize toolbar event handlers
  useEffect(() => {
    // Clear font size cache on mount
    const clearFontCacheEvent = new CustomEvent('tiptap-clear-font-cache');
    document.dispatchEvent(clearFontCacheEvent);
    
    return () => {
      // Clean up any event listeners if needed
    };
  }, []);
  
  if (!editor) {
    return null;
  }

  const currentColor = editor.getAttributes('textStyle').color || '#000000';

  return (
    <div className="rounded-md bg-background p-1 flex flex-wrap gap-2 items-center">
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
