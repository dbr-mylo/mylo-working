
import React from "react";
import { TypographyStyles } from "@/lib/types";
import { FontFamilyControl } from "./FontFamilyControl";
import { FontSizeControl } from "./FontSizeControl";
import { FontWeightControl } from "./FontWeightControl";
import { ColorControl } from "./ColorControl";
import { SpacingControl } from "./SpacingControl";
import { TextAlignmentControl } from "./TextAlignmentControl";
import { TextPreview } from "./TextPreview";

interface StyleFormControlsProps {
  styles: TypographyStyles;
  onStyleChange: (property: keyof TypographyStyles, value: string) => void;
}

export const StyleFormControls = ({ styles, onStyleChange }: StyleFormControlsProps) => {
  return (
    <div className="space-y-4">
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

      {/* Preview */}
      <TextPreview styles={styles} />
    </div>
  );
};
