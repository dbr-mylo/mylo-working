
import { useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";

interface UseTextStyleSelectionProps {
  onStyleChange: (styles: Record<string, string>) => void;
  onStylesChange?: (styles: string) => void;
}

export const useTextStyleSelection = ({
  onStyleChange,
  onStylesChange
}: UseTextStyleSelectionProps) => {
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
        
        // Apply to the selected element
        const styleRecord: Record<string, string> = {};
        Object.entries(newStyles).forEach(([key, val]) => {
          styleRecord[key] = val;
        });
        
        onStyleChange(styleRecord);
      }
    }
  }, [selectedStyleId, textStyles, onStyleChange]);

  return {
    textStyles,
    selectedStyleId,
    styleName,
    setSelectedStyleId,
    setStyleName,
    setTextStyles
  };
};
