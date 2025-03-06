import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { FontPicker } from "@/components/rich-text/FontPicker";
import { Button } from "@/components/ui/button";
import { TextStyle } from "@/lib/types";
import { Save, ArrowLeft, ArrowRight, Type, AlignJustify } from "lucide-react";

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

  // Font weight options
  const fontWeights = [
    { value: "300", label: "Light" },
    { value: "400", label: "Regular" },
    { value: "500", label: "Medium" },
    { value: "600", label: "Semi Bold" },
    { value: "700", label: "Bold" },
    { value: "800", label: "Extra Bold" },
  ];

  // Text align options
  const textAlignOptions = [
    { value: "left", label: "Left", icon: <ArrowLeft className="h-4 w-4" /> },
    { value: "center", label: "Center", icon: <Type className="h-4 w-4" /> },
    { value: "right", label: "Right", icon: <ArrowRight className="h-4 w-4" /> },
    { value: "justify", label: "Justify", icon: <AlignJustify className="h-4 w-4" /> }
  ];

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

  // Helper to convert RGB to Hex
  const rgbToHex = (rgb: string): string => {
    // Handle if it's already a hex value
    if (rgb.startsWith("#")) return rgb;
    
    // Extract rgb values
    const rgbMatch = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!rgbMatch) return "#000000";
    
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

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

  // Format pixel values to numbers for sliders
  const getNumberFromPixelValue = (value: string): number => {
    return parseFloat(value.replace("px", ""));
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
          <div>
            <Label htmlFor="font-family" className="text-xs">Font Family</Label>
            <div className="mt-1">
              <FontPicker 
                value={styles.fontFamily} 
                onChange={(value) => handleStyleChange("fontFamily", value)}
              />
            </div>
          </div>

          {/* Font Size */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="font-size" className="text-xs">Font Size</Label>
              <span className="text-xs text-gray-500">{styles.fontSize}</span>
            </div>
            <div className="flex items-center gap-2">
              <Slider 
                id="font-size"
                value={[getNumberFromPixelValue(styles.fontSize)]} 
                min={8} 
                max={72} 
                step={1}
                onValueChange={(value) => handleStyleChange("fontSize", `${value[0]}px`)}
                className="flex-1"
              />
              <Input
                type="number"
                value={getNumberFromPixelValue(styles.fontSize)}
                onChange={(e) => handleStyleChange("fontSize", `${e.target.value}px`)}
                className="w-16"
                min={8}
                max={72}
              />
            </div>
          </div>

          {/* Font Weight */}
          <div>
            <Label htmlFor="font-weight" className="text-xs">Font Weight</Label>
            <Select
              value={styles.fontWeight}
              onValueChange={(value) => handleStyleChange("fontWeight", value)}
            >
              <SelectTrigger id="font-weight" className="mt-1">
                <SelectValue placeholder="Select weight" />
              </SelectTrigger>
              <SelectContent>
                {fontWeights.map(weight => (
                  <SelectItem key={weight.value} value={weight.value}>
                    {weight.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Text Color */}
          <div>
            <Label htmlFor="text-color" className="text-xs">Color</Label>
            <div className="flex gap-2 items-center mt-1">
              <input
                type="color"
                id="text-color"
                value={styles.color}
                onChange={(e) => handleStyleChange("color", e.target.value)}
                className="w-10 h-10 p-0 border-0 rounded-md"
              />
              <Input
                value={styles.color}
                onChange={(e) => handleStyleChange("color", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Line Height */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="line-height" className="text-xs">Line Height</Label>
              <span className="text-xs text-gray-500">{styles.lineHeight}</span>
            </div>
            <Slider 
              id="line-height"
              value={[parseFloat(styles.lineHeight)]} 
              min={0.5} 
              max={3} 
              step={0.1}
              onValueChange={(value) => handleStyleChange("lineHeight", value[0].toString())}
            />
          </div>

          {/* Letter Spacing */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="letter-spacing" className="text-xs">Letter Spacing</Label>
              <span className="text-xs text-gray-500">{styles.letterSpacing === "0" ? "0px" : styles.letterSpacing}</span>
            </div>
            <Slider 
              id="letter-spacing"
              value={[parseFloat(styles.letterSpacing.replace("px", "") || "0")]} 
              min={-2} 
              max={10} 
              step={0.5}
              onValueChange={(value) => handleStyleChange("letterSpacing", `${value[0]}px`)}
            />
          </div>

          {/* Text Alignment */}
          <div>
            <Label className="text-xs mb-1 block">Text Align</Label>
            <div className="flex gap-2">
              {textAlignOptions.map(option => (
                <Button
                  key={option.value}
                  variant={styles.textAlign === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStyleChange("textAlign", option.value)}
                  title={option.label}
                >
                  {option.icon}
                </Button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
            <Label className="text-xs text-gray-500 mb-2 block">Preview</Label>
            <div style={{ 
              fontFamily: styles.fontFamily,
              fontSize: styles.fontSize,
              fontWeight: styles.fontWeight,
              color: styles.color,
              lineHeight: styles.lineHeight,
              letterSpacing: styles.letterSpacing,
              textAlign: styles.textAlign as "left" | "center" | "right" | "justify"
            }}>
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
        </div>
      ) : (
        <div className="py-6 text-center text-gray-500">
          <AlignJustify className="mx-auto h-10 w-10 opacity-20 mb-2" />
          <p className="text-sm">Select text in the document to edit its properties</p>
        </div>
      )}
    </div>
  );
};
