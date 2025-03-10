
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

/**
 * Completely resets the text styles to defaults
 * This will remove any custom styles and restore only the default ones
 */
export const resetTextStylesToDefaults = (): void => {
  try {
    // Remove the text_styles entry completely
    localStorage.removeItem('text_styles');
    
    // Remove any default style ID
    localStorage.removeItem('default_text_style_id');
    
    // Remove any style-related session storage items
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.includes('style')) {
        sessionStorage.removeItem(key);
      }
    }
    
    // Clear browser indexedDB if available
    if (window.indexedDB) {
      try {
        // Attempt to delete any style-related databases
        const request = window.indexedDB.deleteDatabase('text_styles_db');
        request.onsuccess = () => console.log('IndexedDB storage deleted successfully');
        request.onerror = () => console.error('Error deleting IndexedDB storage');
      } catch (dbError) {
        console.error('IndexedDB operation failed:', dbError);
      }
    }
    
    // Clear any font caches
    localStorage.removeItem('editor_font_size');
    localStorage.removeItem('last_used_font');
    
    // Clear any other related caches
    clearEditorCache();
    
    console.log('Text styles have been reset to defaults');
  } catch (error) {
    console.error('Error resetting text styles:', error);
  }
};

/**
 * Performs a deep clean of all storage
 * This is a more aggressive approach to clearing all caches
 */
export const deepCleanStorage = (): void => {
  try {
    // Log all current localStorage items for debugging
    console.log('Current localStorage items before cleaning:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        console.log(`${key}: ${localStorage.getItem(key)?.substring(0, 100)}...`);
      }
    }
    
    // Reset text styles to defaults
    resetTextStylesToDefaults();
    
    // Clear all editor state
    localStorage.removeItem('editor_state');
    
    // Clear all style-related items with various naming patterns
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.includes('text') || 
        key.includes('style') || 
        key.includes('font') || 
        key.includes('editor') ||
        key.includes('cache') ||
        key.includes('temp')
      )) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      console.log(`Removing localStorage item: ${key}`);
      localStorage.removeItem(key);
    });
    
    // Force reload DEFAULT_TEXT_STYLES from constants
    console.log('Deep clean of storage completed');
    
    // Log remaining localStorage items for verification
    console.log('Remaining localStorage items after cleaning:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        console.log(`${key}: ${localStorage.getItem(key)?.substring(0, 100)}...`);
      }
    }
  } catch (error) {
    console.error('Error performing deep clean of storage:', error);
  }
};

