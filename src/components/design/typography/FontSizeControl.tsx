
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface FontSizeControlProps {
  value: string;
  onChange: (value: string) => void;
}

export const FontSizeControl = ({ value, onChange }: FontSizeControlProps) => {
  // Format pixel values to numbers for sliders
  const getNumberFromPixelValue = (value: string): number => {
    return parseFloat(value.replace("px", ""));
  };

  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-0.5">
        <Label htmlFor="font-size" className="text-xs">Font Size</Label>
        <span className="text-xs text-gray-500">{value}</span>
      </div>
      <div className="flex items-center gap-1">
        <Slider 
          id="font-size"
          value={[getNumberFromPixelValue(value)]} 
          min={8} 
          max={72} 
          step={1}
          onValueChange={(val) => onChange(`${val[0]}px`)}
          className="flex-1"
        />
        <Input
          type="number"
          value={getNumberFromPixelValue(value)}
          onChange={(e) => onChange(`${e.target.value}px`)}
          className="w-14"
          min={8}
          max={72}
        />
      </div>
    </div>
  );
};
