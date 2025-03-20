
import React, { useState, useEffect } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Type } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
  const { role } = useAuth();
  const isDesigner = role === "designer";
  const dropdownHeight = isDesigner ? 'h-7' : 'h-8';
  
  const handleFontChange = (newFont: string) => {
    console.log("FontPicker: Font selected:", newFont);
    onChange(newFont);
  };
  
  return (
    <div className={`flex items-center ${className || ''}`}>
      <Select value={value} onValueChange={handleFontChange}>
        <SelectTrigger 
          className={`${dropdownHeight} w-[200px] bg-white text-xs border-editor-border rounded-md overflow-hidden`}
          style={{ borderRadius: '0.375rem' }}
        >
          <div className="flex items-center gap-1 w-full">
            <Type className="h-3 w-3 flex-shrink-0" />
            <span style={{ fontFamily: value }} className="truncate">
              {value || 'Select Font'}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent 
          className="rounded-md overflow-hidden"
          style={{ zIndex: 9999, backgroundColor: 'white' }}
        >
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
    </div>
  );
};
