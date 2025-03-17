import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FontWeightControlProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

export const FontWeightControl = ({ value, onChange, compact = false }: FontWeightControlProps) => {
  // Font weight options
  const fontWeights = [
    { value: "300", label: "Light" },
    { value: "400", label: "Regular" },
    { value: "500", label: "Medium" },
    { value: "600", label: "Semi Bold" },
    { value: "700", label: "Bold" },
    { value: "800", label: "Extra Bold" },
  ];

  // Ensure value is always a valid string that exists in our fontWeights array
  const safeValue = (() => {
    // If value is falsy, use "400" as default
    if (!value) return "400";
    
    // If value is in our options, use it
    if (fontWeights.some(option => option.value === value)) {
      return value;
    }
    
    // Otherwise, try to find a close match or default to "400"
    const numericWeight = parseInt(value, 10);
    if (!isNaN(numericWeight)) {
      // Find the closest weight
      const availableWeights = fontWeights.map(w => parseInt(w.value, 10));
      const closest = availableWeights.reduce((prev, curr) => 
        Math.abs(curr - numericWeight) < Math.abs(prev - numericWeight) ? curr : prev
      );
      return closest.toString();
    }
    
    return "400"; // Default to regular if all else fails
  })();

  return (
    <div className="mb-1">
      <Label htmlFor="font-weight" className="text-xs mb-0.5 inline-block">Font Weight</Label>
      <Select
        value={safeValue}
        onValueChange={onChange}
      >
        <SelectTrigger id="font-weight" className={compact ? "h-7 text-xs" : ""}>
          <SelectValue placeholder="Select weight" />
        </SelectTrigger>
        <SelectContent>
          {fontWeights.map(weight => (
            <SelectItem key={weight.value} value={weight.value}>
              {weight.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
