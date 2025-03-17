
import React, { useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { useToast } from '@/hooks/use-toast';
import { TextControls } from './TextControls';
import { EditorFormatButtonGroup } from './EditorFormatButtonGroup';
import { EditorListButtonGroup } from './EditorListButtonGroup';
import { EditorAlignmentButtonGroup } from './EditorAlignmentButtonGroup';
import { EditorIndentButtonGroup } from './EditorIndentButtonGroup';
import { EditorClearFormattingButton } from './EditorClearFormattingButton';
import { useIsEditor } from '@/utils/roles';
import { EditorOnly } from '@/utils/roles';

interface EditorToolbarProps {
  editor: Editor;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  const { toast } = useToast();
  const isEditor = useIsEditor();
  
  // Initialize toolbar event handlers
  useEffect(() => {
    // Clear font size cache on mount
    const clearFontCacheEvent = new CustomEvent('tiptap-clear-font-cache');
    document.dispatchEvent(clearFontCacheEvent);
    
    return () => {
      // Clean up any event listeners if needed
    };
  }, []);
  
  if (!editor || !isEditor) {
    return null;
  }

  const currentColor = editor.getAttributes('textStyle').color || '#000000';

  return (
    <EditorOnly>
      <div className="rounded-md bg-background p-1 flex flex-wrap gap-3 items-center editor-toolbar-buttons">
        {/* Text styling controls - font family, font size and color */}
        <TextControls editor={editor} />
        
        {/* Text formatting buttons - bold and italic */}
        <EditorFormatButtonGroup editor={editor} currentColor={currentColor} />

        {/* List buttons - bullet and ordered lists */}
        <EditorListButtonGroup editor={editor} currentColor={currentColor} />
        
        {/* Text alignment buttons */}
        <EditorAlignmentButtonGroup editor={editor} />
        
        {/* Indentation controls */}
        <EditorIndentButtonGroup editor={editor} />
        
        {/* Clear formatting button */}
        <EditorClearFormattingButton editor={editor} />
      </div>
    </EditorOnly>
  );
};
