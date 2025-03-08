
import { TextStyle } from "@/lib/types";
import { getLocalTextStyles } from "../storage";
import { DEFAULT_STYLE_ID_KEY } from "../constants";

export const setDefaultStyle = async (id: string): Promise<void> => {
  try {
    const styles = getLocalTextStyles();
    
    // Update the default flag on all styles
    const updatedStyles = styles.map(style => ({
      ...style,
      isDefault: style.id === id,
      updated_at: style.id === id ? new Date().toISOString() : style.updated_at
    }));
    
    localStorage.setItem('text_styles', JSON.stringify(updatedStyles));
    localStorage.setItem(DEFAULT_STYLE_ID_KEY, id);
  } catch (error) {
    console.error('Error in setDefaultStyle:', error);
    throw error;
  }
};

export const getDefaultStyle = async (): Promise<TextStyle | null> => {
  try {
    const styles = getLocalTextStyles();
    return styles.find(s => s.isDefault) || null;
  } catch (error) {
    console.error('Error in getDefaultStyle:', error);
    return null;
  }
};
