
import { useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";

export const useTextStyles = () => {
  const [styles, setStyles] = useState<TextStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchStyles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const textStyles = await textStyleStore.getTextStyles();
        setStyles(textStyles);
      } catch (err) {
        console.error("Error fetching text styles:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch styles"));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStyles();
  }, []);
  
  const refreshStyles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const textStyles = await textStyleStore.getTextStyles();
      setStyles(textStyles);
    } catch (err) {
      console.error("Error refreshing text styles:", err);
      setError(err instanceof Error ? err : new Error("Failed to refresh styles"));
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveStyle = async (style: TextStyle) => {
    try {
      const savedStyle = await textStyleStore.saveTextStyle(style);
      await refreshStyles();
      return savedStyle;
    } catch (err) {
      console.error("Error saving text style:", err);
      throw err;
    }
  };
  
  const deleteStyle = async (styleId: string) => {
    try {
      await textStyleStore.deleteTextStyle(styleId);
      await refreshStyles();
    } catch (err) {
      console.error("Error deleting text style:", err);
      throw err;
    }
  };
  
  return { 
    styles, 
    isLoading, 
    error, 
    refreshStyles,
    saveStyle,
    deleteStyle
  };
};
