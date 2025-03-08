
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";

interface TextAlignmentControlProps {
  value: string;
  onChange: (value: string) => void;
}

export const TextAlignmentControl = ({ value, onChange }: TextAlignmentControlProps) => {
  // Text align options
  const textAlignOptions = [
    { value: "left", label: "Left", icon: <AlignLeft className="h-4 w-4" /> },
    { value: "center", label: "Center", icon: <AlignCenter className="h-4 w-4" /> },
    { value: "right", label: "Right", icon: <AlignRight className="h-4 w-4" /> },
    { value: "justify", label: "Justify", icon: <AlignJustify className="h-4 w-4" /> }
  ];

  const handleButtonClick = (alignValue: string, e: React.MouseEvent) => {
    // Prevent form submission
    e.preventDefault();
    onChange(alignValue);
  };

  return (
    <div>
      <Label className="text-xs mb-1 block">Text Align</Label>
      <div className="flex gap-2">
        {textAlignOptions.map(option => (
          <Button
            key={option.value}
            variant={value === option.value ? "default" : "outline"}
            size="sm"
            onClick={(e) => handleButtonClick(option.value, e)}
            title={option.label}
            type="button" // Explicitly set type to button to prevent form submission
          >
            {option.icon}
          </Button>
        ))}
      </div>
    </div>
  );
};
