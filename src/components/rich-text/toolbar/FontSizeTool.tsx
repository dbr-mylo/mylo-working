
import React, { useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FontUnit, extractFontSizeValue, convertFontSize } from "@/lib/types/preferences";

interface FontSizeToolProps {
  editor: Editor;
  currentUnit?: FontUnit;
}

export const FontSizeTool = ({ editor, currentUnit = 'px' }: FontSizeToolProps) => {
  const [fontSize, setFontSize] = useState<number>(16);
  
  // Update font size when editor selection changes or when unit changes
  useEffect(() => {
    const updateFontSize = () => {
      const attrs = editor.getAttributes('textStyle');
      const defaultSize = `16${currentUnit}`;
      const fontSize = attrs.fontSize || defaultSize;
      
      // Convert to current unit if needed
      const { value, unit } = extractFontSizeValue(fontSize);
      if (unit === currentUnit) {
        setFontSize(value);
      } else {
        const convertedSize = convertFontSize(fontSize, unit, currentUnit);
        const { value: convertedValue } = extractFontSizeValue(convertedSize);
        setFontSize(convertedValue);
      }
    };
    
    // Update initially
    updateFontSize();
    
    // Add event listeners
    editor.on('selectionUpdate', updateFontSize);
    editor.on('transaction', updateFontSize);
    
    return () => {
      editor.off('selectionUpdate', updateFontSize);
      editor.off('transaction', updateFontSize);
    };
  }, [editor, currentUnit]);

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      setFontSize(newValue);
      const size = `${newValue}${currentUnit}`;
      editor.chain().focus().setFontSize(size).run();
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Input
        id="font-size"
        type="number"
        value={fontSize}
        onChange={handleFontSizeChange}
        className="w-14 h-7 text-xs"
        min={8}
        max={72}
      />
      <span className="text-xs text-muted-foreground">{currentUnit}</span>
    </div>
  );
};
