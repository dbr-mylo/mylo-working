
import { TextStyle } from "@/lib/types";
import { getLocalTextStyles } from "./storage";

/**
 * Gets the default style from the available styles
 */
export const getDefaultStyle = async (): Promise<TextStyle | null> => {
  try {
    const styles = getLocalTextStyles();
    return styles.find(s => s.isDefault) || null;
  } catch (error) {
    console.error('Error in getDefaultStyle:', error);
    return null;
  }
};

/**
 * Finds styles that have the specified parent
 */
export const getStylesWithParent = async (parentId: string): Promise<TextStyle[]> => {
  try {
    const styles = getLocalTextStyles();
    return styles.filter(s => s.parentId === parentId);
  } catch (error) {
    console.error('Error in getStylesWithParent:', error);
    return [];
  }
};
