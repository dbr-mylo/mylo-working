
import { useState, useEffect } from "react";
import { TypographyStyles } from "@/lib/types";
import { rgbToHex } from "../utils";

interface UseTypographyStylesProps {
  selectedElement: HTMLElement | null;
  onStyleChange: (styles: Record<string, string>) => void;
}

export const useTypographyStyles = ({
  selectedElement,
  onStyleChange
}: UseTypographyStylesProps) => {
  const [styles, setStyles] = useState<TypographyStyles>({
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

  return {
    styles,
    handleStyleChange
  };
};
