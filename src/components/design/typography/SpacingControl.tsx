
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface SpacingControlProps {
  type: "lineHeight" | "letterSpacing";
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const SpacingControl = ({ 
  type, 
  value, 
  onChange, 
  min = type === "lineHeight" ? 0.5 : -2, 
  max = type === "lineHeight" ? 3 : 10, 
  step = type === "lineHeight" ? 0.1 : 0.5 
}: SpacingControlProps) => {
  const label = type === "lineHeight" ? "Line Height" : "Letter Spacing";
  const id = type === "lineHeight" ? "line-height" : "letter-spacing";
  
  // Handle parsing the value
  const parseValue = (): number => {
    if (type === "lineHeight") {
      return parseFloat(value);
    } else {
      // Letter spacing might be in px
      return parseFloat(value.replace("px", "") || "0");
    }
  };
  
  // Handle formatting the value for display
  const formatDisplayValue = (): string => {
    if (type === "lineHeight") {
      return value;
    } else {
      return value === "0" ? "0px" : value;
    }
  };
  
  // Handle formatting the output value
  const formatOutputValue = (val: number): string => {
    if (type === "lineHeight") {
      return val.toString();
    } else {
      return `${val}px`;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <Label htmlFor={id} className="text-xs">{label}</Label>
        <span className="text-xs text-gray-500">{formatDisplayValue()}</span>
      </div>
      <Slider 
        id={id}
        value={[parseValue()]} 
        min={min} 
        max={max} 
        step={step}
        onValueChange={(val) => onChange(formatOutputValue(val[0]))}
      />
    </div>
  );
};
