
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Type } from 'lucide-react';

const fonts = [
  { name: 'Default', value: 'Inter' },
  { name: 'Serif', value: 'Georgia' },
  { name: 'Sans Serif', value: 'Arial' },
  { name: 'Monospace', value: 'Consolas' },
  { name: 'Playfair', value: 'Playfair Display' },
];

interface FontPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export const FontPicker = ({ value, onChange }: FontPickerProps) => {
  return (
    <div className="flex items-center">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 w-[130px] bg-white">
          <div className="flex items-center gap-2">
            <Type className="h-3.5 w-3.5" />
            <SelectValue placeholder="Font" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {fonts.map((font) => (
            <SelectItem 
              key={font.value} 
              value={font.value}
              className="flex items-center"
            >
              <span style={{ fontFamily: font.value }}>{font.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
