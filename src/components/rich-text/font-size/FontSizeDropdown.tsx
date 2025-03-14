
import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Preset font sizes as required
const PRESET_FONT_SIZES = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30'];

interface FontSizeDropdownProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const FontSizeDropdown: React.FC<FontSizeDropdownProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  // Extract numeric value for comparison with presets
  const currentSize = value.replace('px', '');

  return (
    <Select 
      value={currentSize} 
      onValueChange={(val) => onChange(`${val}px`)}
      disabled={disabled}
    >
      <SelectTrigger 
        className="w-16 h-7 border-editor-border text-xs rounded-md overflow-hidden"
        style={{ paddingRight: '0.5rem' }}
      >
        <SelectValue placeholder={currentSize} />
        <ChevronDown className="h-3 w-3 ml-auto" />
      </SelectTrigger>
      <SelectContent className="max-h-60 overflow-y-auto">
        {PRESET_FONT_SIZES.map((size) => (
          <SelectItem 
            key={size} 
            value={size} 
            className="text-xs cursor-pointer"
          >
            {size}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
