
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Type, AlignJustify } from "lucide-react";

interface TextAlignmentControlProps {
  value: string;
  onChange: (value: string) => void;
}

export const TextAlignmentControl = ({ value, onChange }: TextAlignmentControlProps) => {
  // Text align options
  const textAlignOptions = [
    { value: "left", label: "Left", icon: <ArrowLeft className="h-4 w-4" /> },
    { value: "center", label: "Center", icon: <Type className="h-4 w-4" /> },
    { value: "right", label: "Right", icon: <ArrowRight className="h-4 w-4" /> },
    { value: "justify", label: "Justify", icon: <AlignJustify className="h-4 w-4" /> }
  ];

  return (
    <div>
      <Label className="text-xs mb-1 block">Text Align</Label>
      <div className="flex gap-2">
        {textAlignOptions.map(option => (
          <Button
            key={option.value}
            variant={value === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(option.value)}
            title={option.label}
          >
            {option.icon}
          </Button>
        ))}
      </div>
    </div>
  );
};
