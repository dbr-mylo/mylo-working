
import React from "react";
import { TextStyle, TypographyStyles } from "@/lib/types";
import { FontFamilyControl } from "./FontFamilyControl";
import { FontSizeControl } from "./FontSizeControl";
import { FontWeightControl } from "./FontWeightControl";
import { ColorControl } from "./ColorControl";
import { SpacingControl } from "./SpacingControl";
import { TextAlignmentControl } from "./TextAlignmentControl";
import { TextPreview } from "./TextPreview";

interface StyleFormProps {
  styles: TypographyStyles;
  handleStyleChange: (property: keyof TypographyStyles, value: string) => void;
}

export const StyleForm = ({ styles, handleStyleChange }: StyleFormProps) => {
  return (
    <div className="space-y-4">
      {/* Font Family */}
      <FontFamilyControl 
        value={styles.fontFamily} 
        onChange={(value) => handleStyleChange("fontFamily", value)} 
      />

      {/* Font Size */}
      <FontSizeControl 
        value={styles.fontSize} 
        onChange={(value) => handleStyleChange("fontSize", value)} 
      />

      {/* Font Weight */}
      <FontWeightControl 
        value={styles.fontWeight} 
        onChange={(value) => handleStyleChange("fontWeight", value)} 
      />

      {/* Text Color */}
      <ColorControl 
        value={styles.color} 
        onChange={(value) => handleStyleChange("color", value)} 
      />

      {/* Line Height */}
      <SpacingControl 
        type="lineHeight"
        value={styles.lineHeight} 
        onChange={(value) => handleStyleChange("lineHeight", value)} 
      />

      {/* Letter Spacing */}
      <SpacingControl 
        type="letterSpacing"
        value={styles.letterSpacing} 
        onChange={(value) => handleStyleChange("letterSpacing", value)} 
      />

      {/* Text Alignment */}
      <TextAlignmentControl 
        value={styles.textAlign} 
        onChange={(value) => handleStyleChange("textAlign", value)} 
      />

      {/* Preview */}
      <TextPreview styles={styles} />
    </div>
  );
};
