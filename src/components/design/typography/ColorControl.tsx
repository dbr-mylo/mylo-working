
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ColorControlProps {
  value: string;
  onChange: (value: string) => void;
}

export const ColorControl = ({ value, onChange }: ColorControlProps) => {
  return (
    <div className="mb-2">
      <Label htmlFor="text-color" className="text-xs mb-0.5 inline-block">Color</Label>
      <div className="flex gap-1 items-center">
        <input
          type="color"
          id="text-color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 p-0 border-0 rounded-md"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  );
};
