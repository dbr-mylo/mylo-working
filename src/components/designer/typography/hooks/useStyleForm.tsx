import { useState, useEffect } from "react";
import { TextStyle, TypographyStyles } from "@/lib/types";

interface UseStyleFormProps {
  initialValues?: TextStyle;
  externalStyles?: TypographyStyles;
  externalStyleChange?: (property: keyof TypographyStyles, value: string) => void;
}

export const useStyleForm = ({
  initialValues,
  externalStyles,
  externalStyleChange
}: UseStyleFormProps) => {
  // Style name
  const [name, setName] = useState(initialValues?.name || "");
  
  // Parent style relationship
  const [parentId, setParentId] = useState<string | undefined>(initialValues?.parentId);
  
  // Typography properties
  const [styles, setStyles] = useState<TypographyStyles>({
    fontFamily: initialValues?.fontFamily || externalStyles?.fontFamily || "Inter",
    fontSize: initialValues?.fontSize || externalStyles?.fontSize || "16px",
    fontWeight: initialValues?.fontWeight || externalStyles?.fontWeight || "400",
    color: initialValues?.color || externalStyles?.color || "#000000",
    lineHeight: initialValues?.lineHeight || externalStyles?.lineHeight || "1.5",
    letterSpacing: initialValues?.letterSpacing || externalStyles?.letterSpacing || "0",
    textAlign: initialValues?.textAlign || externalStyles?.textAlign || "left"
  });
  
  // Update styles when external styles change
  useEffect(() => {
    if (externalStyles) {
      setStyles(externalStyles);
    }
  }, [externalStyles]);
  
  // Update form when initialValues change
  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setParentId(initialValues.parentId);
      
      setStyles({
        fontFamily: initialValues.fontFamily || "Inter",
        fontSize: initialValues.fontSize || "16px",
        fontWeight: initialValues.fontWeight || "400",
        color: initialValues.color || "#000000",
        lineHeight: initialValues.lineHeight || "1.5",
        letterSpacing: initialValues.letterSpacing || "0",
        textAlign: initialValues.textAlign || "left"
      });
    }
  }, [initialValues]);
  
  // Style change handler
  const handleStyleChange = (property: keyof TypographyStyles, value: string) => {
    if (externalStyleChange) {
      // If external handler provided, use it
      externalStyleChange(property, value);
    } else {
      // Otherwise update internal state
      setStyles(prev => ({
        ...prev,
        [property]: value
      }));
    }
  };
  
  // Parent style change handler
  const handleParentChange = (id: string | undefined) => {
    setParentId(id);
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
