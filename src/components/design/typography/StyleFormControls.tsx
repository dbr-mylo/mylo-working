
import React from "react";
import { TypographyStyles, TextStyle } from "@/lib/types";
import { FontFamilyControl } from "./FontFamilyControl";
import { FontSizeControl } from "./FontSizeControl";
import { FontWeightControl } from "./FontWeightControl";
import { ColorControl } from "./ColorControl";
import { SpacingControl } from "./SpacingControl";
import { TextAlignmentControl } from "./TextAlignmentControl";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link2 } from "lucide-react";
import { useDocument } from "@/hooks/document";
import { useParams } from "react-router-dom";
import { convertFontSize, extractFontSizeValue, FontUnit } from "@/lib/types/preferences";

interface StyleFormControlsProps {
  styles: TypographyStyles;
  onStyleChange: (property: keyof TypographyStyles, value: string) => void;
  parentStyle?: TextStyle | null;
  currentUnit?: FontUnit;
}

export const StyleFormControls = ({ 
  styles, 
  onStyleChange, 
  parentStyle,
  currentUnit: propCurrentUnit
}: StyleFormControlsProps) => {
  const { documentId } = useParams<{ documentId?: string }>();
  const { preferences } = useDocument(documentId);
  const currentUnit = propCurrentUnit || preferences?.typography?.fontUnit || 'px';
  
  // Function to determine if a property is inherited from parent
  const isInherited = (property: keyof TypographyStyles): boolean => {
    if (!parentStyle) return false;
    
    // Check if this property matches the parent's property
    return parentStyle[property] === styles[property];
  };

  // Handle font size changes
  const handleFontSizeChange = (value: string) => {
    onStyleChange("fontSize", value);
  };
  
  // Get the display font size according to the current unit
  const getDisplayFontSize = (): string => {
    const { value, unit } = extractFontSizeValue(styles.fontSize);
    if (unit === currentUnit) {
      return styles.fontSize;
    }
    return convertFontSize(styles.fontSize, unit, currentUnit);
  };
  
  return (
    <div className="space-y-6">
      {parentStyle && (
        <div className="bg-muted/30 p-2 rounded border border-muted flex items-center space-x-2">
          <Link2 className="h-4 w-4 text-muted-foreground" />
          <div className="text-xs">
            <span className="text-muted-foreground">Inherits from: </span>
            <span className="font-medium">{parentStyle.name}</span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Font Controls */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Font Settings</h3>
          
          {/* Font Family */}
          <div className="space-y-1">
            <FontFamilyControl 
              value={styles.fontFamily} 
              onChange={(value) => onStyleChange("fontFamily", value)} 
            />
            {isInherited("fontFamily") && (
              <Badge variant="outline" className="text-[10px] h-4 bg-primary/10 text-primary border-primary/20">
                Inherited
              </Badge>
            )}
          </div>

          {/* Font Size */}
          <div className="space-y-1">
            <FontSizeControl 
              value={getDisplayFontSize()} 
              onChange={handleFontSizeChange}
              currentUnit={currentUnit}
            />
            {isInherited("fontSize") && (
              <Badge variant="outline" className="text-[10px] h-4 bg-primary/10 text-primary border-primary/20">
                Inherited
              </Badge>
            )}
          </div>

          {/* Font Weight */}
          <div className="space-y-1">
            <FontWeightControl 
              value={styles.fontWeight} 
              onChange={(value) => onStyleChange("fontWeight", value)} 
            />
            {isInherited("fontWeight") && (
              <Badge variant="outline" className="text-[10px] h-4 bg-primary/10 text-primary border-primary/20">
                Inherited
              </Badge>
            )}
          </div>
        </div>
        
        {/* Right column - Text Controls */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Text Settings</h3>
          
          {/* Text Color */}
          <div className="space-y-1">
            <ColorControl 
              value={styles.color} 
              onChange={(value) => onStyleChange("color", value)} 
            />
            {isInherited("color") && (
              <Badge variant="outline" className="text-[10px] h-4 bg-primary/10 text-primary border-primary/20">
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
            />
            {isInherited("lineHeight") && (
              <Badge variant="outline" className="text-[10px] h-4 bg-primary/10 text-primary border-primary/20">
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
            />
            {isInherited("letterSpacing") && (
              <Badge variant="outline" className="text-[10px] h-4 bg-primary/10 text-primary border-primary/20">
                Inherited
              </Badge>
            )}
          </div>

          {/* Text Alignment */}
          <div className="space-y-1">
            <TextAlignmentControl 
              value={styles.textAlign} 
              onChange={(value) => onStyleChange("textAlign", value)} 
            />
            {isInherited("textAlign") && (
              <Badge variant="outline" className="text-[10px] h-4 bg-primary/10 text-primary border-primary/20">
                Inherited
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
