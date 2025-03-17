
import React from "react";
import { Label } from "@/components/ui/label";
import { FontPicker } from "@/components/rich-text/FontPicker";

interface FontFamilyControlProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

export const FontFamilyControl = ({ value, onChange, compact = false }: FontFamilyControlProps) => {
  return (
    <div className="mb-1">
      <Label htmlFor="font-family" className="text-xs mb-0.5 inline-block">Font Family</Label>
      <div>
        <FontPicker 
          value={value} 
          onChange={onChange}
          className={compact ? "h-7 text-xs" : ""}
        />
      </div>
    </div>
  );
};
