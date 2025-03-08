
import React from "react";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";

interface TextAlignmentControlProps {
  value: string;
  onChange: (value: string) => void;
}

export const TextAlignmentControl = ({ value, onChange }: TextAlignmentControlProps) => {
  const alignOptions = [
    { value: "left", icon: AlignLeft, label: "Left" },
    { value: "center", icon: AlignCenter, label: "Center" },
    { value: "right", icon: AlignRight, label: "Right" },
    { value: "justify", icon: AlignJustify, label: "Justify" }
  ];

  return (
    <div>
      <Label htmlFor="text-align" className="text-xs block mb-1">Text Alignment</Label>
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={(val) => val && onChange(val)}
        className="justify-start"
      >
        {alignOptions.map((option) => {
          const Icon = option.icon;
          return (
            <ToggleGroupItem 
              key={option.value} 
              value={option.value}
              aria-label={option.label}
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <Icon className="h-4 w-4" />
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
};
