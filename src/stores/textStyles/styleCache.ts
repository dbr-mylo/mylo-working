
/**
 * Utility functions for managing text style cache
 */

/**
 * Clears any cached styles from localStorage that match certain patterns
 * This is helpful when we want to remove specific styles like "Clear to Default"
 */
export const clearCachedStylesByPattern = (patterns: string[]): void => {
  try {
    // Get all text styles from localStorage
    const textStylesJson = localStorage.getItem('text_styles');
    if (!textStylesJson) return;
    
    const textStyles = JSON.parse(textStylesJson);
    
    // Filter out styles that match any of the provided patterns
    const filteredStyles = textStyles.filter((style: any) => {
      // Check if the style name matches any of the patterns
      return !patterns.some(pattern => 
        style.name && style.name.toLowerCase().includes(pattern.toLowerCase())
      );
    });
    
    // Save the filtered styles back to localStorage
    localStorage.setItem('text_styles', JSON.stringify(filteredStyles));
    console.log(`Cleared cached styles matching patterns: ${patterns.join(', ')}`);
  } catch (error) {
    console.error('Error clearing cached styles:', error);
  }
};

/**
 * Clears the "Clear to Default" style from cache
 */
export const clearDefaultResetStyle = (): void => {
  clearCachedStylesByPattern(['Clear to Default', 'Reset to Default']);
};

/**
 * Clears all editor-related caches and storage
 */
export const clearEditorCache = (): void => {
  try {
    // Clear font size related storage
    localStorage.removeItem('editor_font_size');
    
    // Clear any stored text styles that might be causing issues
    clearCachedStylesByPattern(['font-size', 'fontSize']);
    
    // Clear any other editor-related items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('editor') || key.includes('font') || key.includes('style'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log('Editor cache cleared successfully');
  } catch (error) {
    console.error('Error clearing editor cache:', error);
  }
};
