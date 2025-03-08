import { useState, useEffect } from "react";
import { TextStyle, TypographyStyles, StyleFormData } from "@/lib/types";

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
  // State for using the form in "controlled mode"
  const [name, setName] = useState(initialValues?.name || "");
  const [selector, setSelector] = useState(initialValues?.selector || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [parentId, setParentId] = useState(initialValues?.parentId);
  
  // Internal styles state when not in controlled mode
  const [internalStyles, setInternalStyles] = useState<TypographyStyles>({
    fontFamily: initialValues?.fontFamily || "Inter",
    fontSize: initialValues?.fontSize || "16px",
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
      setSelector(initialValues.selector || "");
      setDescription(initialValues.description || "");
      setParentId(initialValues.parentId);
      
      setInternalStyles({
        fontFamily: initialValues.fontFamily || "Inter",
        fontSize: initialValues.fontSize || "16px",
        fontWeight: initialValues.fontWeight || "400",
        color: initialValues.color || "#000000",
        lineHeight: initialValues.lineHeight || "1.5",
        letterSpacing: initialValues.letterSpacing || "0px",
        textAlign: initialValues.textAlign || "left",
      });
    }
  }, [initialValues, externalStyles]);

  const handleStyleChange = (property: keyof TypographyStyles, value: string) => {
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
    selector, 
    setSelector,
    description,
    setDescription,
    parentId,
    handleParentChange,
    styles,
    handleStyleChange
  };
};
