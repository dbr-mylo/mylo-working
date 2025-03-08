
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TextStyle } from "@/lib/types";
import { Save, PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { textStyleStore } from "@/stores/textStyles"; // Updated import path

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
  onStylesChange?: (styles: string) => void;
}

interface TypographyStyles {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  lineHeight: string;
  letterSpacing: string;
  textAlign: string;
}

export const TypographyPanel = ({ 
  selectedElement, 
  onStyleChange,
  onSaveStyle,
  onStylesChange
}: TypographyPanelProps) => {
  const { toast } = useToast();
  const [styles, setStyles] = useState<TypographyStyles>({
    fontFamily: "Inter",
    fontSize: "16px",
    fontWeight: "400",
    color: "#000000",
    lineHeight: "1.5",
    letterSpacing: "0",
    textAlign: "left"
  });
  const [textStyles, setTextStyles] = useState<TextStyle[]>([]);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [styleName, setStyleName] = useState("New Style");

  // Load text styles when component mounts
  useEffect(() => {
    const loadTextStyles = async () => {
      const styles = await textStyleStore.getTextStyles();
      setTextStyles(styles);
      
      // Generate CSS and update parent component if provided
      if (onStylesChange) {
        const css = textStyleStore.generateCSSFromTextStyles(styles);
        onStylesChange(css);
      }
    };
    
    loadTextStyles();
  }, [onStylesChange]);

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

  // When a text style is selected, apply it to the current styles
  useEffect(() => {
    if (selectedStyleId) {
      const style = textStyles.find(s => s.id === selectedStyleId);
      if (style) {
        const newStyles = {
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          color: style.color,
          lineHeight: style.lineHeight,
          letterSpacing: style.letterSpacing,
          textAlign: "left" // Default, as text styles don't include alignment
        };
        
        setStyles(newStyles);
        
        // Apply to the selected element
        const styleRecord: Record<string, string> = {};
        Object.entries(newStyles).forEach(([key, val]) => {
          styleRecord[key] = val;
        });
        
        onStyleChange(styleRecord);
      }
    }
  }, [selectedStyleId, textStyles, onStyleChange]);

  const handleStyleChange = (property: keyof TypographyStyles, value: string) => {
    const newStyles = { ...styles, [property]: value };
    setStyles(newStyles);
    
    // Convert to Record<string, string> for the parent component
    const styleRecord: Record<string, string> = {};
    Object.entries(newStyles).forEach(([key, val]) => {
      styleRecord[key] = val;
    });
    
    onStyleChange(styleRecord);
  };

  const handleSaveStyle = async () => {
    if (!styleName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for this style",
        variant: "destructive"
      });
      return;
    }

    try {
      const selector = selectedElement?.tagName.toLowerCase() || "p";
      const styleData = {
        name: styleName,
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        color: styles.color,
        lineHeight: styles.lineHeight,
        letterSpacing: styles.letterSpacing,
        selector
      };
      
      // Call the onSaveStyle prop if provided
      if (onSaveStyle) {
        onSaveStyle(styleData);
      }
      
      // Save to textStyleStore directly
      const savedStyle = await textStyleStore.saveTextStyle(styleData);
      
      // Update the local text styles
      setTextStyles(prev => {
        const index = prev.findIndex(s => s.id === savedStyle.id);
        if (index >= 0) {
          const newStyles = [...prev];
          newStyles[index] = savedStyle;
          return newStyles;
        } else {
          return [...prev, savedStyle];
        }
      });
      
      // Update selected style ID
      setSelectedStyleId(savedStyle.id);
      
      // Generate CSS and update parent component if provided
      if (onStylesChange) {
        const allStyles = await textStyleStore.getTextStyles();
        const css = textStyleStore.generateCSSFromTextStyles(allStyles);
        onStylesChange(css);
      }
      
      toast({
        title: "Style saved",
        description: "Text style has been saved successfully"
      });
    } catch (error) {
      console.error("Error saving style:", error);
      toast({
        title: "Error saving style",
        description: "There was a problem saving your text style",
        variant: "destructive"
      });
    }
  };

  const handleDeleteStyle = async (id: string) => {
    try {
      await textStyleStore.deleteTextStyle(id);
      
      // Update local state
      const updatedStyles = textStyles.filter(s => s.id !== id);
      setTextStyles(updatedStyles);
      
      // Clear selected style if it was deleted
      if (selectedStyleId === id) {
        setSelectedStyleId(null);
      }
      
      // Generate CSS and update parent component if provided
      if (onStylesChange) {
        const css = textStyleStore.generateCSSFromTextStyles(updatedStyles);
        onStylesChange(css);
      }
      
      toast({
        title: "Style deleted",
        description: "Text style has been deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting style:", error);
      toast({
        title: "Error deleting style",
        description: "There was a problem deleting the text style",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-sm border border-gray-200 space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Typography Properties</h3>
        </div>

        {/* Text Style Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium">Text Styles</label>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveStyle}
                className="h-8"
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                Save
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select
              value={selectedStyleId || ""}
              onValueChange={setSelectedStyleId}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a text style" />
              </SelectTrigger>
              <SelectContent>
                {textStyles.map(style => (
                  <SelectItem key={style.id} value={style.id}>
                    <span style={{ fontFamily: style.fontFamily }}>
                      {style.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedStyleId && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => selectedStyleId && handleDeleteStyle(selectedStyleId)}
                className="h-10 w-10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={styleName}
              onChange={(e) => setStyleName(e.target.value)}
              placeholder="Style name"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
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
    </div>
  );
};
