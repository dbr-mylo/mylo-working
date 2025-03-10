
import { TextStyle } from "@/lib/types";
import { getLocalTextStyles } from "./storage";
import { DEFAULT_STYLE_ID_KEY } from "./constants";

/**
 * Gets the default text style
 */
export const getDefaultStyle = async (forceRefresh = false): Promise<TextStyle | null> => {
  try {
    // Get the default style ID from localStorage
    const defaultStyleId = localStorage.getItem(DEFAULT_STYLE_ID_KEY);
    if (!defaultStyleId) return null;
    
    // Get all styles and find the default one
    const styles = getLocalTextStyles(forceRefresh);
    const defaultStyle = styles.find(s => s.id === defaultStyleId);
    
    if (!defaultStyle) {
      console.warn('Default style ID exists but style not found:', defaultStyleId);
      return null;
    }
    
    return defaultStyle;
  } catch (error) {
    console.error('Error in getDefaultStyle:', error);
    return null;
  }
};

/**
 * Gets all styles that have the specified parent ID
 */
export const getStylesWithParent = async (parentId: string): Promise<TextStyle[]> => {
  try {
    if (!parentId) return [];
    
    const styles = getLocalTextStyles();
    return styles.filter(s => s.parentId === parentId);
  } catch (error) {
    console.error('Error in getStylesWithParent:', error);
    return [];
  }
};
