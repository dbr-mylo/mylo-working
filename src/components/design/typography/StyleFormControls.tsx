
import React from "react";
import { TypographyStyles, TextStyle } from "@/lib/types";
import { FontFamilyControl } from "./FontFamilyControl";
import { FontSizeControl } from "./FontSizeControl";
import { FontWeightControl } from "./FontWeightControl";
import { ColorControl } from "./ColorControl";
import { SpacingControl } from "./SpacingControl";
import { TextAlignmentControl } from "./TextAlignmentControl";
import { Badge } from "@/components/ui/badge";
import { Link2 } from "lucide-react";

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
  // Function to determine if a property is inherited from parent
  const isInherited = (property: keyof TypographyStyles): boolean => {
    if (!parentStyle) return false;
    
    // Check if this property matches the parent's property
    return parentStyle[property] === styles[property];
  };
  
  const spacing = compact ? "space-y-4" : "space-y-6";
  const controlSpacing = compact ? "space-y-3" : "space-y-4";
  const badgeSize = compact ? "text-[9px] h-3.5" : "text-[10px] h-4";
  
  return (
    <div className={spacing}>
      {parentStyle && (
        <div className="bg-muted/30 p-1.5 rounded border border-muted flex items-center space-x-2">
          <Link2 className="h-3 w-3 text-muted-foreground" />
          <div className="text-[10px]">
            <span className="text-muted-foreground">Inherits from: </span>
            <span className="font-medium">{parentStyle.name}</span>
          </div>
        </div>
      )}
      
      <div className={controlSpacing}>
        {/* Font Family */}
        <div className="space-y-1">
          <FontFamilyControl 
            value={styles.fontFamily} 
            onChange={(value) => onStyleChange("fontFamily", value)}
            compact={compact} 
          />
          {isInherited("fontFamily") && (
            <Badge variant="outline" className={`${badgeSize} bg-primary/10 text-primary border-primary/20`}>
              Inherited
            </Badge>
          )}
        </div>

        {/* Font Size */}
        <div className="space-y-1">
          <FontSizeControl 
            value={styles.fontSize} 
            onChange={(value) => onStyleChange("fontSize", value)}
            compact={compact}
          />
          {isInherited("fontSize") && (
            <Badge variant="outline" className={`${badgeSize} bg-primary/10 text-primary border-primary/20`}>
              Inherited
            </Badge>
          )}
        </div>

        {/* Font Weight */}
        <div className="space-y-1">
          <FontWeightControl 
            value={styles.fontWeight} 
            onChange={(value) => onStyleChange("fontWeight", value)}
            compact={compact}
          />
          {isInherited("fontWeight") && (
            <Badge variant="outline" className={`${badgeSize} bg-primary/10 text-primary border-primary/20`}>
              Inherited
            </Badge>
          )}
        </div>
        
        {/* Text Color */}
        <div className="space-y-1">
          <ColorControl 
            value={styles.color} 
            onChange={(value) => onStyleChange("color", value)}
            compact={compact}
          />
          {isInherited("color") && (
            <Badge variant="outline" className={`${badgeSize} bg-primary/10 text-primary border-primary/20`}>
              Inherited
            </Badge>
          )}
        </div>

        {/* Line Height */}
        <div className="space-y-1">
          <SpacingControl 
            type="lineHeight"
            value={styles.lineHeight} 
            onChange={(value) => onStyleChange("lineHeight", value)}
            compact={compact}
          />
          {isInherited("lineHeight") && (
            <Badge variant="outline" className={`${badgeSize} bg-primary/10 text-primary border-primary/20`}>
              Inherited
            </Badge>
          )}
        </div>

        {/* Letter Spacing */}
        <div className="space-y-1">
          <SpacingControl 
            type="letterSpacing"
            value={styles.letterSpacing} 
            onChange={(value) => onStyleChange("letterSpacing", value)}
            compact={compact}
          />
          {isInherited("letterSpacing") && (
            <Badge variant="outline" className={`${badgeSize} bg-primary/10 text-primary border-primary/20`}>
              Inherited
            </Badge>
          )}
        </div>

        {/* Text Alignment */}
        <div className="space-y-1">
          <TextAlignmentControl 
            value={styles.textAlign} 
            onChange={(value) => onStyleChange("textAlign", value)}
            compact={compact}
          />
          {isInherited("textAlign") && (
            <Badge variant="outline" className={`${badgeSize} bg-primary/10 text-primary border-primary/20`}>
              Inherited
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
