
import { useState, useEffect } from "react";
import { TextStyle, TypographyStyles } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { v4 as uuidv4 } from 'uuid';

export const useStyleApplicatorTest = () => {
  const [styles, setStyles] = useState<TextStyle[]>([]);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [newStyleId, setNewStyleId] = useState<string>(uuidv4());
  const [newStyleParentId, setNewStyleParentId] = useState<string | undefined>(undefined);
  const [newStyleProperties, setNewStyleProperties] = useState<TypographyStyles>({
    fontFamily: "Inter",
    fontSize: "16px",
    fontWeight: "400",
    color: "#000000",
    lineHeight: "1.5",
    letterSpacing: "0px",
    textAlign: "left"
  });

  useEffect(() => {
    const loadStyles = async () => {
      try {
        console.log("Loading text styles...");
        const loadedStyles = await textStyleStore.getTextStyles();
        console.log("Loaded styles:", loadedStyles);
        setStyles(loadedStyles);
        
        if (loadedStyles.length > 0 && !selectedStyleId) {
          setSelectedStyleId(loadedStyles[0].id);
        }
      } catch (error) {
        console.error("Error loading styles:", error);
      }
    };
    
    loadStyles();
  }, [selectedStyleId]);

  const handleStyleChange = (property: keyof TypographyStyles, value: string) => {
    setNewStyleProperties(prev => ({
      ...prev,
      [property]: value
    }));
  };

  const handleParentChange = (parentId: string | undefined) => {
    console.log("Parent changed to:", parentId);
    setNewStyleParentId(parentId);
  };

  const handleSaveNewStyle = async () => {
    try {
      const styleToSave = {
        id: newStyleId,
        name: `Test Style ${new Date().toISOString().slice(11, 19)}`,
        fontFamily: newStyleProperties.fontFamily,
        fontSize: newStyleProperties.fontSize,
        fontWeight: newStyleProperties.fontWeight,
        color: newStyleProperties.color,
        lineHeight: newStyleProperties.lineHeight,
        letterSpacing: newStyleProperties.letterSpacing,
        textAlign: newStyleProperties.textAlign,
        selector: "p",
        parentId: newStyleParentId
      };
      
      console.log("Saving new style:", styleToSave);
      const savedStyle = await textStyleStore.saveTextStyle(styleToSave);
      console.log("Saved style:", savedStyle);
      
      setNewStyleId(uuidv4());
      setSelectedStyleId(savedStyle.id);
      
      const updatedStyles = await textStyleStore.getTextStyles();
      setStyles(updatedStyles);
    } catch (error) {
      console.error("Error saving style:", error);
    }
  };

  const handleApplyStyle = async (styleId: string) => {
    try {
      const style = await textStyleStore.getStyleWithInheritance(styleId);
      console.log("Style with inheritance:", style);
    } catch (error) {
      console.error("Error applying style:", error);
    }
  };

  return {
    styles,
    selectedStyleId,
    setSelectedStyleId,
    newStyleId,
    newStyleParentId,
    newStyleProperties,
    handleStyleChange,
    handleParentChange,
    handleSaveNewStyle,
    handleApplyStyle
  };
};
