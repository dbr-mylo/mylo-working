
import { useState, useEffect } from "react";
import { TextStyle, TypographyStyles } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";
import { rgbToHex } from "./utils";

interface UseTypographyPanelProps {
  selectedElement: HTMLElement | null;
  onStyleChange: (styles: Record<string, string>) => void;
  onSaveStyle?: (style: Partial<TextStyle>) => void;
  onStylesChange?: (styles: string) => void;
}

export const useTypographyPanel = ({
  selectedElement,
  onStyleChange,
  onSaveStyle,
  onStylesChange
}: UseTypographyPanelProps) => {
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

  return {
    styles,
    textStyles,
    selectedStyleId,
    styleName,
    setSelectedStyleId,
    setStyleName,
    handleStyleChange,
    handleSaveStyle,
    handleDeleteStyle
  };
};
