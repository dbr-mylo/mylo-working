
import { TextStyle } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { TEXT_STYLE_STORAGE_KEY, DEFAULT_TEXT_STYLES } from "./constants";

export const getTextStyles = async (forceRefresh = false): Promise<TextStyle[]> => {
  try {
    // For authenticated designers, fetch from Supabase (future implementation)
    const { data: session } = await supabase.auth.getSession();
    if (session.session?.user) {
      // This would connect to a Supabase table in the future
      // For now, just use localStorage
      return getLocalTextStyles(forceRefresh);
    }
    
    // For guest designers, fetch from localStorage
    return getLocalTextStyles(forceRefresh);
  } catch (error) {
    console.error('Error in getTextStyles:', error);
    return getLocalTextStyles(forceRefresh);
  }
};

// Add a cache for text styles
let textStylesCache: TextStyle[] | null = null;

export const getLocalTextStyles = (forceRefresh = false): TextStyle[] => {
  try {
    // If we have a cache and don't need to refresh, return it
    if (textStylesCache && !forceRefresh) {
      return textStylesCache;
    }
    
    const stylesJSON = localStorage.getItem(TEXT_STYLE_STORAGE_KEY);
    if (stylesJSON) {
      const parsedStyles = JSON.parse(stylesJSON);
      textStylesCache = parsedStyles;
      return parsedStyles;
    } else {
      // Initialize with default styles if none exist
      localStorage.setItem(TEXT_STYLE_STORAGE_KEY, JSON.stringify(DEFAULT_TEXT_STYLES));
      textStylesCache = DEFAULT_TEXT_STYLES;
      return DEFAULT_TEXT_STYLES;
    }
  } catch (error) {
    console.error('Error parsing text styles from localStorage:', error);
    return DEFAULT_TEXT_STYLES;
  }
};

export const saveLocalTextStyle = (style: TextStyle): void => {
  try {
    const styles = getLocalTextStyles(true); // Force refresh when saving
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
    
    // Update the cache
    textStylesCache = styles;
    
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('Error saving text style to localStorage:', error);
    throw error;
  }
};

// Clear the cache (useful when needing to force a refresh)
export const clearTextStylesCache = (): void => {
  textStylesCache = null;
  // Dispatch storage event to notify other components
  window.dispatchEvent(new Event('storage'));
};
