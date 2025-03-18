
import React from "react";
import { Label } from "@/components/ui/label";
import { FontPicker } from "@/components/rich-text/FontPicker";

interface FontFamilyControlProps {
  value: string;
  onChange: (value: string) => void;
}

export const FontFamilyControl = ({ value, onChange }: FontFamilyControlProps) => {
  return (
    <div className="mb-2">
      <Label htmlFor="font-family" className="text-xs mb-0.5 inline-block">Font Family</Label>
      <div>
        <FontPicker 
          value={value} 
          onChange={onChange}
        />
      </div>
    </div>
  );
};
