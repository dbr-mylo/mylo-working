
import React from "react";
import { TypographyStyles } from "@/lib/types";
import { FontFamilyControl } from "./FontFamilyControl";
import { FontSizeControl } from "./FontSizeControl";
import { FontWeightControl } from "./FontWeightControl";
import { ColorControl } from "./ColorControl";
import { SpacingControl } from "./SpacingControl";
import { TextAlignmentControl } from "./TextAlignmentControl";
import { Separator } from "@/components/ui/separator";

interface StyleFormControlsProps {
  styles: TypographyStyles;
  onStyleChange: (property: keyof TypographyStyles, value: string) => void;
}

export const StyleFormControls = ({ styles, onStyleChange }: StyleFormControlsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Font Controls */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Font Settings</h3>
          
          {/* Font Family */}
          <FontFamilyControl 
            value={styles.fontFamily} 
            onChange={(value) => onStyleChange("fontFamily", value)} 
          />

          {/* Font Size */}
          <FontSizeControl 
            value={styles.fontSize} 
            onChange={(value) => onStyleChange("fontSize", value)} 
          />

          {/* Font Weight */}
          <FontWeightControl 
            value={styles.fontWeight} 
            onChange={(value) => onStyleChange("fontWeight", value)} 
          />
        </div>
        
        {/* Right column - Text Controls */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Text Settings</h3>
          
          {/* Text Color */}
          <ColorControl 
            value={styles.color} 
            onChange={(value) => onStyleChange("color", value)} 
          />

          {/* Line Height */}
          <SpacingControl 
            type="lineHeight"
            value={styles.lineHeight} 
            onChange={(value) => onStyleChange("lineHeight", value)} 
          />

          {/* Letter Spacing */}
          <SpacingControl 
            type="letterSpacing"
            value={styles.letterSpacing} 
            onChange={(value) => onStyleChange("letterSpacing", value)} 
          />

          {/* Text Alignment */}
          <TextAlignmentControl 
            value={styles.textAlign} 
            onChange={(value) => onStyleChange("textAlign", value)} 
          />
        </div>
      </div>
    </div>
  );
};
