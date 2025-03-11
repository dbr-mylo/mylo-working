
/**
 * Utility functions for managing text style cache
 */
import { TEXT_STYLE_STORAGE_KEY, DEFAULT_STYLE_ID_KEY, DEFAULT_TEXT_STYLES } from "./constants";

/**
 * Clears cached styles from localStorage that match certain patterns
 */
export const clearCachedStylesByPattern = (patterns: string[]): void => {
  try {
    // Get all text styles from localStorage
    const textStylesJson = localStorage.getItem(TEXT_STYLE_STORAGE_KEY);
    if (!textStylesJson) return;
    
    const textStyles = JSON.parse(textStylesJson);
    
    // Filter out styles that match any of the provided patterns
    const filteredStyles = textStyles.filter((style: any) => {
      return !patterns.some(pattern => 
        style.name && style.name.toLowerCase().includes(pattern.toLowerCase())
      );
    });
    
    // Save the filtered styles back to localStorage
    localStorage.setItem(TEXT_STYLE_STORAGE_KEY, JSON.stringify(filteredStyles));
    console.log(`Cleared cached styles matching patterns: ${patterns.join(', ')}`);
  } catch (error) {
    console.error('Error clearing cached styles:', error);
  }
};

/**
 * Clears the editor-related cache items
 */
export const clearEditorCache = (): void => {
  try {
    // Clear font size storage
    localStorage.removeItem('editor_font_size');
    
    // Clear related style patterns
    clearCachedStylesByPattern(['font-size', 'fontSize']);
    
    console.log('Editor cache cleared successfully');
  } catch (error) {
    console.error('Error clearing editor cache:', error);
  }
};

/**
 * Resets text styles to defaults
 */
export const resetTextStylesToDefaults = (): void => {
  try {
    // Remove the text_styles entry
    localStorage.removeItem(TEXT_STYLE_STORAGE_KEY);
    
    // Remove default style ID
    localStorage.removeItem(DEFAULT_STYLE_ID_KEY);
    
    // Clear font caches
    localStorage.removeItem('editor_font_size');
    
    console.log('Text styles have been reset to defaults');
  } catch (error) {
    console.error('Error resetting text styles:', error);
  }
};
