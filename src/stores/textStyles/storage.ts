
import { TextStyle } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { TEXT_STYLE_STORAGE_KEY, DEFAULT_TEXT_STYLES } from "./constants";

export const getTextStyles = async (): Promise<TextStyle[]> => {
  try {
    // For authenticated designers, fetch from Supabase (future implementation)
    const { data: session } = await supabase.auth.getSession();
    if (session.session?.user) {
      // This would connect to a Supabase table in the future
      // For now, just use localStorage
      return getLocalTextStyles();
    }
    
    // For guest designers, fetch from localStorage
    return getLocalTextStyles();
  } catch (error) {
    console.error('Error in getTextStyles:', error);
    return getLocalTextStyles();
  }
};

export const getLocalTextStyles = (): TextStyle[] => {
  try {
    const stylesJSON = localStorage.getItem(TEXT_STYLE_STORAGE_KEY);
    if (stylesJSON) {
      const parsedStyles = JSON.parse(stylesJSON);
      
      // Check if parsed styles is an array
      if (!Array.isArray(parsedStyles)) {
        console.error('Invalid text styles format in localStorage:', parsedStyles);
        localStorage.removeItem(TEXT_STYLE_STORAGE_KEY);
        return DEFAULT_TEXT_STYLES;
      }
      
      // Validate each style has required properties
      const validatedStyles = parsedStyles.filter(style => 
        style && 
        typeof style === 'object' && 
        style.id && 
        style.name && 
        style.fontFamily
      );
      
      // If we lost styles during validation, save the valid ones back
      if (validatedStyles.length !== parsedStyles.length) {
        console.warn(`Found ${parsedStyles.length - validatedStyles.length} invalid styles, removing them.`);
        localStorage.setItem(TEXT_STYLE_STORAGE_KEY, JSON.stringify(validatedStyles));
      }
      
      return validatedStyles;
    } else {
      // Initialize with default styles if none exist
      localStorage.setItem(TEXT_STYLE_STORAGE_KEY, JSON.stringify(DEFAULT_TEXT_STYLES));
      return DEFAULT_TEXT_STYLES;
    }
  } catch (error) {
    console.error('Error parsing text styles from localStorage:', error);
    // Reset to defaults on error
    localStorage.setItem(TEXT_STYLE_STORAGE_KEY, JSON.stringify(DEFAULT_TEXT_STYLES));
    return DEFAULT_TEXT_STYLES;
  }
};

export const saveLocalTextStyle = (style: TextStyle): void => {
  try {
    const styles = getLocalTextStyles();
    const existingIndex = styles.findIndex(s => s.id === style.id);
    
    // Update or add the style
    if (existingIndex >= 0) {
      // Preserve the created_at date and isSystem flag if they exist
      const existingStyle = styles[existingIndex];
      style.created_at = existingStyle.created_at;
      style.isSystem = existingStyle.isSystem;
      styles[existingIndex] = style;
    } else {
      styles.push(style);
    }
    
    localStorage.setItem(TEXT_STYLE_STORAGE_KEY, JSON.stringify(styles));
  } catch (error) {
    console.error('Error saving text style to localStorage:', error);
    throw error;
  }
};
