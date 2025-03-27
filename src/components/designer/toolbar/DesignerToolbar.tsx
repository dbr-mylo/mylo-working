
import React, { useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { useToast } from '@/hooks/use-toast';
import { useIsDesigner } from '@/utils/roles';
import { DesignerTextControls } from './DesignerTextControls';
import { DesignerStyleControls } from './DesignerStyleControls';
import { Separator } from '@/components/ui/separator';
import { DesignerFormatButtonGroup } from '@/components/toolbar/designer/DesignerFormatButtonGroup';
import { DesignerListButtonGroup } from '@/components/toolbar/designer/DesignerListButtonGroup';
import { DesignerAlignmentButtonGroup } from '@/components/toolbar/designer/DesignerAlignmentButtonGroup';
import { DesignerIndentButtonGroup } from '@/components/toolbar/designer/DesignerIndentButtonGroup';
import { DesignerClearFormattingButton } from '@/components/toolbar/designer/DesignerClearFormattingButton';

interface DesignerToolbarProps {
  editor: Editor;
  currentFont: string;
  currentColor: string;
  onFontChange: (font: string) => void;
  onColorChange: (color: string) => void;
}

export const DesignerToolbar: React.FC<DesignerToolbarProps> = ({
  editor,
  currentFont,
  currentColor,
  onFontChange,
  onColorChange
}) => {
  const { toast } = useToast();
  const isDesigner = useIsDesigner();
  
  // Initialize toolbar event handlers
  useEffect(() => {
    // Clear font size cache on mount
    const clearFontCacheEvent = new CustomEvent('tiptap-clear-font-cache');
    document.dispatchEvent(clearFontCacheEvent);
    
    return () => {
      // Clean up any event listeners if needed
    };
  }, []);
  
  if (!editor || !isDesigner) {
    return null;
  }

  return (
    <div className="rounded-md flex flex-wrap gap-2 items-center p-0.5 designer-toolbar">
      {/* Text styling controls - font family and color */}
      <DesignerTextControls 
        editor={editor}
        currentFont={currentFont}
        onFontChange={onFontChange} 
        currentColor={currentColor}
        onColorChange={onColorChange}
      />
      
      <Separator orientation="vertical" className="mx-0.5 h-5" />
      
      {/* Text formatting buttons - bold and italic */}
      <DesignerFormatButtonGroup editor={editor} currentColor={currentColor} />

      {/* List buttons - bullet and ordered lists */}
      <DesignerListButtonGroup editor={editor} currentColor={currentColor} />
      
      <Separator orientation="vertical" className="mx-0.5 h-5" />
      
      {/* Alignment buttons */}
      <DesignerAlignmentButtonGroup editor={editor} />
      
      {/* Indentation controls */}
      <DesignerIndentButtonGroup editor={editor} />
      
      <Separator orientation="vertical" className="mx-0.5 h-5" />
      
      {/* Style controls for designers */}
      <DesignerStyleControls editor={editor} />
      
      <Separator orientation="vertical" className="mx-0.5 h-5" />
      
      {/* Clear formatting button */}
      <DesignerClearFormattingButton 
        editor={editor} 
        onFontChange={onFontChange}
        onColorChange={onColorChange}
      />
    </div>
  );
};
