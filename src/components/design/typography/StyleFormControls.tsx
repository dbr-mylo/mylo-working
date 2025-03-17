import React from "react";
import { TextStyle, TypographyStyles } from "@/lib/types";
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
  parentStyle?: TextStyle | null;
  compact?: boolean;
}

export const StyleFormControls = ({ 
  styles, 
  onStyleChange,
  parentStyle,
  compact = false
}: StyleFormControlsProps) => {
  // Ensure default values for form controls
  const safeStyles = {
    fontFamily: styles.fontFamily || "Inter",
    fontSize: styles.fontSize || "16px",
    fontWeight: styles.fontWeight || "400",
    color: styles.color || "#000000",
    lineHeight: styles.lineHeight || "1.5",
    letterSpacing: styles.letterSpacing || "0",
    textAlign: styles.textAlign || "left",
    // Other style properties
    ...styles
  };

  return (
    <div className="space-y-2">
      <FontFamilyControl 
        value={safeStyles.fontFamily} 
        onChange={(value) => onStyleChange('fontFamily', value)} 
        compact={compact}
      />
      
      <div className="grid grid-cols-2 gap-2">
        <FontSizeControl 
          value={safeStyles.fontSize} 
          onChange={(value) => onStyleChange('fontSize', value)} 
          compact={compact}
        />
        <FontWeightControl 
          value={safeStyles.fontWeight} 
          onChange={(value) => onStyleChange('fontWeight', value)} 
          compact={compact}
        />
      </div>
      
      <ColorControl 
        value={safeStyles.color} 
        onChange={(value) => onStyleChange('color', value)} 
        compact={compact}
      />
      
      <div className="grid grid-cols-2 gap-2">
        <SpacingControl 
          label="Line Height" 
          value={safeStyles.lineHeight} 
          onChange={(value) => onStyleChange('lineHeight', value)} 
          compact={compact}
        />
        <SpacingControl 
          label="Letter Spacing" 
          value={safeStyles.letterSpacing} 
          onChange={(value) => onStyleChange('letterSpacing', value)} 
          compact={compact}
        />
      </div>
      
      <TextAlignmentControl 
        value={safeStyles.textAlign} 
        onChange={(value) => onStyleChange('textAlign', value)} 
        compact={compact}
      />
    </div>
  );
};
