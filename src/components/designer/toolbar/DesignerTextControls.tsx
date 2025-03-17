
import React from 'react';
import { Editor } from '@tiptap/react';
import { FontPicker } from '@/components/rich-text/FontPicker';
import { ColorPicker } from '@/components/rich-text/ColorPicker';
import { CombinedFontSizeControl } from '@/components/rich-text/font-size';
import { useFontSizeTracking } from '@/components/rich-text/toolbar/hooks/useFontSizeTracking';
import { useIsDesigner } from '@/utils/roles';

interface DesignerTextControlsProps {
  editor: Editor;
  currentFont: string;
  onFontChange: (font: string) => void;
  currentColor: string;
  onColorChange: (color: string) => void;
}

export const DesignerTextControls: React.FC<DesignerTextControlsProps> = ({
  editor,
  currentFont,
  onFontChange,
  currentColor,
  onColorChange
}) => {
  const isDesigner = useIsDesigner();
  
  if (!isDesigner) {
    console.warn("DesignerTextControls used outside of designer role context");
    return null;
  }
  
  const { 
    currentFontSize, 
    isTextSelected, 
    handleFontSizeChange 
  } = useFontSizeTracking(editor);

  return (
    <div className="flex items-center gap-2">
      <FontPicker value={currentFont} onChange={onFontChange} />
      
      <CombinedFontSizeControl 
        value={currentFontSize}
        onChange={handleFontSizeChange}
        disabled={!isTextSelected}
      />
      
      <ColorPicker value={currentColor} onChange={onColorChange} />
    </div>
  );
};
