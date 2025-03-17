
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

  // Ensure value is always a non-empty string
  const safeValue = value || "400";

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
