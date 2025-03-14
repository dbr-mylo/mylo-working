
import React from 'react';
import { Editor } from '@tiptap/react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Type } from 'lucide-react';

const fonts = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Merriweather', value: 'Merriweather' },
  { name: 'Georgia', value: 'Georgia' },
  { name: 'Arial', value: 'Arial' },
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Playfair Display', value: 'Playfair Display' },
];

interface FontSelectProps {
  editor: Editor;
}

export const FontSelect: React.FC<FontSelectProps> = ({ editor }) => {
  const currentFont = editor.getAttributes('textStyle').fontFamily || 'Inter';

  const handleFontChange = (font: string) => {
    editor.chain().focus().setFontFamily(font).run();
  };

  return (
    <Select value={currentFont} onValueChange={handleFontChange}>
      <SelectTrigger 
        className="w-[120px] h-7 border-editor-border rounded-md overflow-hidden" 
        style={{ borderRadius: '0.375rem' }}
      >
        <div className="flex items-center gap-1">
          <Type className="h-3 w-3 flex-shrink-0" />
          <span style={{ fontFamily: currentFont }} className="truncate text-xs">
            {currentFont || 'Inter'}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent className="rounded-md overflow-hidden">
        {fonts.map((font) => (
          <SelectItem 
            key={font.value} 
            value={font.value}
            className="flex items-center text-xs"
          >
            <span style={{ fontFamily: font.value }} className="truncate">
              {font.name}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
