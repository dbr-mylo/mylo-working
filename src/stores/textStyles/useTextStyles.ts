
import { useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { useTextStyleStore } from "./textStyleState";
import { useToast } from "@/hooks/use-toast";
import { FontUnit } from "@/lib/types/preferences";

export const useTextStyles = () => {
  const [styles, setStyles] = useState<TextStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getTextStyles } = useTextStyleStore();
  const { toast } = useToast();

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        setIsLoading(true);
        const fetchedStyles = await getTextStyles();
        setStyles(fetchedStyles);
      } catch (error) {
        console.error("Error loading text styles:", error);
        toast({
          title: "Error loading styles",
          description: "Could not load text styles",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStyles();
  }, [getTextStyles, toast]);

  return {
    styles,
    isLoading
  };
};

// Convenience hook to access all text style operations
export const useTextStyleOperations = () => {
  const {
    getTextStyles,
    getStyleWithInheritance,
    convertAllStylesToUnit,
    saveTextStyle,
    deleteTextStyle,
    duplicateTextStyle,
    setDefaultStyle,
    generateCSSFromTextStyles
  } = useTextStyleStore();

  return {
    getTextStyles,
    getStyleWithInheritance,
    convertAllStylesToUnit,
    saveTextStyle,
    deleteTextStyle,
    duplicateTextStyle,
    setDefaultStyle,
    generateCSSFromTextStyles
  };
};

// Specialized hook for working with CSS generation
export const useTextStyleCSS = (currentUnit?: FontUnit) => {
  const [css, setCss] = useState<string>("");
  const { generateCSSFromTextStyles, getTextStyles } = useTextStyleStore();
  
  useEffect(() => {
    const generateStyles = async () => {
      const styles = await getTextStyles();
      const generatedCss = generateCSSFromTextStyles(styles, currentUnit);
      setCss(generatedCss);
    };
    
    generateStyles();
  }, [currentUnit, generateCSSFromTextStyles, getTextStyles]);

  return { css };
};
