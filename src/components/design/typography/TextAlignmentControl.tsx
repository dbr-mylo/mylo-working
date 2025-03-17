
import React from "react";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";

interface TextAlignmentControlProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

export const TextAlignmentControl = ({ value, onChange, compact = false }: TextAlignmentControlProps) => {
  const iconSize = compact ? 14 : 16;
  
  return (
    <div className="mb-1">
      <Label className="text-xs mb-0.5 inline-block">Text Alignment</Label>
      <ToggleGroup type="single" value={value} onValueChange={onChange} className="justify-start">
        <ToggleGroupItem 
          value="left" 
          aria-label="Align left"
          className={compact ? "h-7 w-7" : ""}
        >
          <AlignLeft className={`h-${iconSize} w-${iconSize}`} />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="center" 
          aria-label="Align center"
          className={compact ? "h-7 w-7" : ""}
        >
          <AlignCenter className={`h-${iconSize} w-${iconSize}`} />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="right" 
          aria-label="Align right"
          className={compact ? "h-7 w-7" : ""}
        >
          <AlignRight className={`h-${iconSize} w-${iconSize}`} />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="justify" 
          aria-label="Justify"
          className={compact ? "h-7 w-7" : ""}
        >
          <AlignJustify className={`h-${iconSize} w-${iconSize}`} />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
