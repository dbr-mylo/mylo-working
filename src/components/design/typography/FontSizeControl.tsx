
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FontSizeControlProps {
  value: string;
  onChange: (value: string) => void;
}

export const FontSizeControl = ({ value, onChange }: FontSizeControlProps) => {
  // Common font size options
  const fontSizes = [
    { value: "12px", label: "12px" },
    { value: "14px", label: "14px" },
    { value: "16px", label: "16px" },
    { value: "18px", label: "18px" },
    { value: "20px", label: "20px" },
    { value: "24px", label: "24px" },
    { value: "30px", label: "30px" },
    { value: "36px", label: "36px" },
    { value: "48px", label: "48px" },
    { value: "60px", label: "60px" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Add "px" if it's just a number
    if (/^\d+$/.test(newValue)) {
      newValue = `${newValue}px`;
    }
    
    onChange(newValue);
  };

  return (
    <div className="mb-2">
      <Label htmlFor="font-size" className="text-xs mb-0.5 inline-block">Font Size</Label>
      <div className="flex items-center gap-2">
        <Input
          id="font-size"
          type="text"
          value={value}
          onChange={handleInputChange}
          className="flex-1"
        />
        <select
          className="p-2 border rounded-md text-sm"
          value={fontSizes.some(size => size.value === value) ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>Preset</option>
          {fontSizes.map(size => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
