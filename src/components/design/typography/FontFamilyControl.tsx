
import React from "react";
import { Label } from "@/components/ui/label";
import { FontPicker } from "@/components/rich-text/FontPicker";

interface FontFamilyControlProps {
  value: string;
  onChange: (value: string) => void;
}

export const FontFamilyControl = ({ value, onChange }: FontFamilyControlProps) => {
  return (
    <div>
      <Label htmlFor="font-family" className="text-xs">Font Family</Label>
      <div className="mt-1">
        <FontPicker 
          value={value} 
          onChange={onChange}
        />
      </div>
    </div>
  );
};
