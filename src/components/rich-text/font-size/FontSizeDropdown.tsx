
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TEXT_PRESETS } from './constants';

interface FontSizeDropdownProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const FontSizeDropdown: React.FC<FontSizeDropdownProps> = ({
  value,
  onChange,
  disabled = false,
  className
}) => {
  // Extract numeric value from fontsize with 'px'
  const fontSizeValue = value.replace('px', '');
  
  const handleValueChange = (val: string) => {
    console.log("FontSizeDropdown: Selected", val, "px");
    onChange(`${val}px`);
  };
  
  return (
    <div className={className}>
      <Select
        value={fontSizeValue}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger 
          className="h-7 w-[4.5rem] text-xs" 
          disabled={disabled}
        >
          <SelectValue placeholder="Size" />
        </SelectTrigger>
        <SelectContent>
          {TEXT_PRESETS.map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
