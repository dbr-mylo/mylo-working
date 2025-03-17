
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface FontSizeControlProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

export const FontSizeControl = ({ value, onChange, compact = false }: FontSizeControlProps) => {
  // Constants for min/max font size values according to requirements
  const MIN_FONT_SIZE = 1;
  const MAX_FONT_SIZE = 99;

  // Format pixel values to numbers for sliders
  const getNumberFromPixelValue = (value: string): number => {
    return parseFloat(value.replace("px", ""));
  };

  return (
    <div className="mb-1">
      <div className="flex justify-between items-center mb-0.5">
        <Label htmlFor="font-size" className="text-xs">Font Size</Label>
        <span className="text-xs text-gray-500">{value}</span>
      </div>
      <div className="flex items-center gap-1">
        <Slider 
          id="font-size"
          value={[getNumberFromPixelValue(value)]} 
          min={MIN_FONT_SIZE} 
          max={MAX_FONT_SIZE} 
          step={1}
          onValueChange={(val) => onChange(`${val[0]}px`)}
          className={`flex-1 ${compact ? "h-3" : ""}`}
        />
        <Input
          type="number"
          value={getNumberFromPixelValue(value)}
          onChange={(e) => {
            const numValue = parseInt(e.target.value, 10);
            if (!isNaN(numValue) && numValue >= MIN_FONT_SIZE && numValue <= MAX_FONT_SIZE) {
              onChange(`${numValue}px`);
            }
          }}
          className={`w-12 ${compact ? "h-6 text-xs px-1" : ""}`}
          min={MIN_FONT_SIZE}
          max={MAX_FONT_SIZE}
        />
      </div>
    </div>
  );
};
