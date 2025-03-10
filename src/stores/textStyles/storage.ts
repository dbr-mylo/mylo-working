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
    console.log('Attempting to get local text styles from localStorage');
    const stylesJSON = localStorage.getItem(TEXT_STYLE_STORAGE_KEY);
    
    if (stylesJSON) {
      console.log(`Found styles in localStorage: ${stylesJSON.substring(0, 100)}...`);
      
      let parsedStyles;
      try {
        parsedStyles = JSON.parse(stylesJSON);
      } catch (parseError) {
        console.error('Error parsing styles JSON:', parseError);
        console.log('Invalid JSON in localStorage, returning defaults');
        localStorage.removeItem(TEXT_STYLE_STORAGE_KEY);
        localStorage.setItem(TEXT_STYLE_STORAGE_KEY, JSON.stringify(DEFAULT_TEXT_STYLES));
        return DEFAULT_TEXT_STYLES;
      }
      
      // Check if parsed styles is an array
      if (!Array.isArray(parsedStyles)) {
        console.error('Invalid text styles format in localStorage:', parsedStyles);
        localStorage.removeItem(TEXT_STYLE_STORAGE_KEY);
        localStorage.setItem(TEXT_STYLE_STORAGE_KEY, JSON.stringify(DEFAULT_TEXT_STYLES));
        return DEFAULT_TEXT_STYLES;
      }
      
      // Log the number of styles found
      console.log(`Found ${parsedStyles.length} styles in localStorage`);
      
      // Check for and remove duplicate style names
      const nameMap = new Map<string, TextStyle>();
      parsedStyles.forEach((style: TextStyle) => {
        if (style && style.name) {
          if (nameMap.has(style.name)) {
            // Keep the newer style if it has an updated_at timestamp
            const existingStyle = nameMap.get(style.name)!;
            if (style.updated_at && existingStyle.updated_at && 
                new Date(style.updated_at) > new Date(existingStyle.updated_at)) {
              nameMap.set(style.name, style);
              console.log(`Replacing duplicate style "${style.name}" with newer version`);
            } else {
              console.log(`Ignoring duplicate style "${style.name}"`);
            }
          } else {
            nameMap.set(style.name, style);
          }
        }
      });
      
      // Convert back to array and filter out invalid styles
      const deduplicatedStyles = Array.from(nameMap.values());
      
      // Validate each style has required properties
      const validatedStyles = deduplicatedStyles.filter(style => 
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
      
      // Log the validated styles for debugging
      console.log('Validated styles:', validatedStyles.map(s => s.name).join(', '));
      
      return validatedStyles;
    } else {
      // Initialize with default styles if none exist
      console.log('No styles found in localStorage, initializing with defaults');
      localStorage.setItem(TEXT_STYLE_STORAGE_KEY, JSON.stringify(DEFAULT_TEXT_STYLES));
      return DEFAULT_TEXT_STYLES;
    }
  } catch (error) {
    console.error('Error parsing text styles from localStorage:', error);
    // Reset to defaults on error
    console.log('Resetting to default styles due to error');
    localStorage.setItem(TEXT_STYLE_STORAGE_KEY, JSON.stringify(DEFAULT_TEXT_STYLES));
    return DEFAULT_TEXT_STYLES;
  }
};

export const saveLocalTextStyle = (style: TextStyle): void => {
  try {
    console.log(`Saving style "${style.name}" to localStorage`);
    const styles = getLocalTextStyles();
    const existingIndex = styles.findIndex(s => s.id === style.id);
    
    // Update or add the style
    if (existingIndex >= 0) {
      // Preserve the created_at date and isSystem flag if they exist
      const existingStyle = styles[existingIndex];
      style.created_at = existingStyle.created_at;
      style.isSystem = existingStyle.isSystem;
      styles[existingIndex] = style;
      console.log(`Updated existing style "${style.name}"`);
    } else {
      styles.push(style);
      console.log(`Added new style "${style.name}"`);
    }
    
    localStorage.setItem(TEXT_STYLE_STORAGE_KEY, JSON.stringify(styles));
  } catch (error) {
    console.error('Error saving text style to localStorage:', error);
    throw error;
  }
};
