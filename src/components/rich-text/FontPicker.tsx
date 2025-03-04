
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
  { name: 'Inter', value: 'Inter' },
  { name: 'Playfair Display', value: 'Playfair Display' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Merriweather', value: 'Merriweather' },
  { name: 'Source Sans Pro', value: 'Source Sans Pro' },
  { name: 'Georgia', value: 'Georgia' },
  { name: 'Arial', value: 'Arial' },
  { name: 'Consolas', value: 'Consolas' },
];

interface FontPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const FontPicker = ({ value, onChange, className }: FontPickerProps) => {
  return (
    <div className={`flex items-center ${className || ''}`}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 w-[180px] bg-white">
          <div className="flex items-center gap-2">
            <Type className="h-3.5 w-3.5" />
            <span style={{ fontFamily: value }}>
              {value || 'Select Font'}
            </span>
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

