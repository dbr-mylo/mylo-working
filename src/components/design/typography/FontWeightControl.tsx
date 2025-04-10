
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FontWeightControlProps {
  value: string;
  onChange: (value: string) => void;
}

export const FontWeightControl = ({ value, onChange }: FontWeightControlProps) => {
  // Font weight options
  const fontWeights = [
    { value: "300", label: "Light" },
    { value: "400", label: "Regular" },
    { value: "500", label: "Medium" },
    { value: "600", label: "Semi Bold" },
    { value: "700", label: "Bold" },
    { value: "800", label: "Extra Bold" },
  ];

  return (
    <div className="mb-2">
      <Label htmlFor="font-weight" className="text-xs mb-0.5 inline-block">Font Weight</Label>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger id="font-weight">
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
