
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TextStyle } from "@/lib/types";
import { Save } from "lucide-react";

// Import smaller components
import { FontFamilyControl } from "./typography/FontFamilyControl";
import { FontSizeControl } from "./typography/FontSizeControl";
import { FontWeightControl } from "./typography/FontWeightControl";
import { ColorControl } from "./typography/ColorControl";
import { SpacingControl } from "./typography/SpacingControl";
import { TextAlignmentControl } from "./typography/TextAlignmentControl";
import { TextPreview } from "./typography/TextPreview";
import { EmptyState } from "./typography/EmptyState";
import { rgbToHex } from "./typography/utils";

interface TypographyPanelProps {
  selectedElement: HTMLElement | null;
  onStyleChange: (styles: Record<string, string>) => void;
  onSaveStyle?: (style: Partial<TextStyle>) => void;
}

export const TypographyPanel = ({ 
  selectedElement, 
  onStyleChange,
  onSaveStyle 
}: TypographyPanelProps) => {
  const [styles, setStyles] = useState<Record<string, string>>({
    fontFamily: "Inter",
    fontSize: "16px",
    fontWeight: "400",
    color: "#000000",
    lineHeight: "1.5",
    letterSpacing: "0",
    textAlign: "left"
  });

  // When selected element changes, extract its current styles
  useEffect(() => {
    if (selectedElement) {
      const computedStyle = window.getComputedStyle(selectedElement);
      
      setStyles({
        fontFamily: computedStyle.fontFamily.split(",")[0].replace(/['"]/g, "") || "Inter",
        fontSize: computedStyle.fontSize || "16px",
        fontWeight: computedStyle.fontWeight || "400",
        color: rgbToHex(computedStyle.color) || "#000000",
        lineHeight: computedStyle.lineHeight !== "normal" ? computedStyle.lineHeight : "1.5",
        letterSpacing: computedStyle.letterSpacing !== "normal" ? computedStyle.letterSpacing : "0",
        textAlign: computedStyle.textAlign || "left"
      });
    }
  }, [selectedElement]);

  const handleStyleChange = (property: string, value: string) => {
    const newStyles = { ...styles, [property]: value };
    setStyles(newStyles);
    onStyleChange(newStyles);
  };

  const handleSaveStyle = () => {
    if (onSaveStyle) {
      const selector = selectedElement?.tagName.toLowerCase() || "p";
      onSaveStyle({
        name: `Style for ${selector}`,
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        color: styles.color,
        lineHeight: styles.lineHeight,
        letterSpacing: styles.letterSpacing,
        selector
      });
    }
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-sm border border-gray-200 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Typography Properties</h3>
        {onSaveStyle && (
          <Button size="sm" variant="outline" onClick={handleSaveStyle}>
            <Save className="h-3.5 w-3.5 mr-1" />
            Save Style
          </Button>
        )}
      </div>

      {selectedElement ? (
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
      ) : (
        <EmptyState />
      )}
    </div>
  );
};
