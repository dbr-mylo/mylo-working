
import React from 'react';
import { Editor } from '@tiptap/react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FontUnit, extractFontSizeValue } from "@/lib/types/preferences";

interface FontSizeToolProps {
  editor: Editor;
  currentUnit?: FontUnit;
}

export const FontSizeTool = ({ editor, currentUnit = 'px' }: FontSizeToolProps) => {
  const getCurrentFontSize = (): string => {
    const attrs = editor.getAttributes('textStyle');
    const fontSize = attrs.fontSize || `16${currentUnit}`;
    
    // Convert to current unit if needed
    const { value, unit } = extractFontSizeValue(fontSize);
    if (unit === currentUnit) {
      return fontSize;
    }
    const convertedValue = currentUnit === 'pt' ? value * 0.75 : value * 1.333;
    return `${Math.round(convertedValue)}${currentUnit}`;
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!newValue) return;
    
    const size = `${newValue}${currentUnit}`;
    editor.chain().focus().setFontSize(size).run();
  };

  const currentSize = extractFontSizeValue(getCurrentFontSize()).value;

  return (
    <div className="flex items-center gap-1">
      <Input
        id="font-size"
        type="number"
        value={currentSize}
        onChange={handleFontSizeChange}
        className="w-14 h-7 text-xs"
        min={8}
        max={72}
      />
      <span className="text-xs text-muted-foreground">{currentUnit}</span>
    </div>
  );
};
