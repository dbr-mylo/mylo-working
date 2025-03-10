
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
