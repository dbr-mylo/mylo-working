
import { useState, useEffect } from "react";
import { TextStyle, TypographyStyles, StyleFormData } from "@/lib/types";
import { FontUnit, convertFontSize, extractFontSizeValue } from "@/lib/types/preferences";

interface UseStyleFormProps {
  initialValues?: TextStyle;
  externalStyles?: TypographyStyles;
  externalStyleChange?: (property: keyof TypographyStyles, value: string) => void;
  currentUnit?: FontUnit;
}

export const useStyleForm = ({ 
  initialValues, 
  externalStyles, 
  externalStyleChange,
  currentUnit = 'px'
}: UseStyleFormProps) => {
  // State for using the form in "controlled mode"
  const [name, setName] = useState(initialValues?.name || "");
  const [parentId, setParentId] = useState(initialValues?.parentId);
  
  // Internal styles state when not in controlled mode
  const [internalStyles, setInternalStyles] = useState<TypographyStyles>({
    fontFamily: initialValues?.fontFamily || "Inter",
    fontSize: initialValues?.fontSize || `16${currentUnit}`,
    fontWeight: initialValues?.fontWeight || "400",
    color: initialValues?.color || "#000000",
    lineHeight: initialValues?.lineHeight || "1.5",
    letterSpacing: initialValues?.letterSpacing || "0px",
    textAlign: initialValues?.textAlign || "left",
  });

  // Use either external or internal styles
  const styles = externalStyles || internalStyles;

  // Update internal styles when initialValues change
  useEffect(() => {
    if (initialValues && !externalStyles) {
      setName(initialValues.name || "");
      setParentId(initialValues.parentId);
      
      // Convert font size if needed
      let fontSize = initialValues.fontSize || `16${currentUnit}`;
      if (currentUnit) {
        const { unit } = extractFontSizeValue(fontSize);
        if (unit !== currentUnit) {
          fontSize = convertFontSize(fontSize, unit, currentUnit);
        }
      }
      
      setInternalStyles({
        fontFamily: initialValues.fontFamily || "Inter",
        fontSize: fontSize,
        fontWeight: initialValues.fontWeight || "400",
        color: initialValues.color || "#000000",
        lineHeight: initialValues.lineHeight || "1.5",
        letterSpacing: initialValues.letterSpacing || "0px",
        textAlign: initialValues.textAlign || "left",
      });
    }
  }, [initialValues, externalStyles, currentUnit]);

  const handleStyleChange = (property: keyof TypographyStyles, value: string) => {
    // Convert font size if needed for the fontSize property
    if (property === 'fontSize' && currentUnit) {
      const { unit } = extractFontSizeValue(value);
      if (unit && unit !== currentUnit) {
        value = convertFontSize(value, unit, currentUnit);
      }
    }
    
    if (externalStyleChange) {
      // Use external handler if provided
      externalStyleChange(property, value);
    } else {
      // Otherwise update internal state
      setInternalStyles(prev => ({
        ...prev,
        [property]: value
      }));
    }
  };

  const handleParentChange = (newParentId: string | undefined) => {
    setParentId(newParentId);
  };

  return {
    name,
    setName,
    parentId,
    handleParentChange,
    styles,
    handleStyleChange
  };
};
