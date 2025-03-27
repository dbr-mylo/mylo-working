
import React, { useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { useToast } from '@/hooks/use-toast';
import { TextControls } from './TextControls';
import { WriterFormatButtonGroup } from '@/components/toolbar/writer/WriterFormatButtonGroup';
import { WriterListButtonGroup } from '@/components/toolbar/writer/WriterListButtonGroup';
import { WriterAlignmentButtonGroup } from '@/components/toolbar/writer/WriterAlignmentButtonGroup';
import { WriterIndentButtonGroup } from '@/components/toolbar/writer/WriterIndentButtonGroup';
import { WriterClearFormattingButton } from '@/components/toolbar/writer/WriterClearFormattingButton';

interface EditorToolbarProps {
  editor: Editor;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
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
    <div className="rounded-md bg-background p-1 flex flex-wrap gap-3 items-center editor-toolbar-buttons">
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
