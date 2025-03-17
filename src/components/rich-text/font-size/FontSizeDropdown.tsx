
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
    
    // Ensure we format the value consistently and trigger style refresh
    const newSize = `${val}px`;
    onChange(newSize);
    
    // Dispatch a custom event to force a style update
    try {
      const event = new CustomEvent('tiptap-clear-font-cache');
      document.dispatchEvent(event);
    } catch (error) {
      console.error("Error dispatching font cache event:", error);
    }
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
        <SelectContent
          position="popper"
          align="start"
          sideOffset={5}
          className="font-size-dropdown-content"
          avoidCollisions={true}
          collisionPadding={20}
          style={{ 
            backgroundColor: 'white',
            zIndex: 9999,
            borderRadius: '0.375rem',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
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
