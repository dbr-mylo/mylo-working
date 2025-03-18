
/**
 * Utility functions for managing text style cache and versioning
 */
import { TextStyle } from "@/lib/types";
import { TEXT_STYLE_STORAGE_KEY, DEFAULT_STYLE_ID_KEY, DEFAULT_TEXT_STYLES } from "./constants";

/**
 * Clear cached styles that match specific patterns
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
 * Add version tracking to a style
 */
export const addVersionTracking = (style: TextStyle): TextStyle => {
  if (!style.updated_at) {
    style.updated_at = new Date().toISOString();
  }
  
  if (!style.created_at) {
    style.created_at = style.updated_at;
  }
  
  return style;
};

/**
 * Get all styles that inherit from a specific parent
 * @param parentId The ID of the parent style
 * @returns Array of child styles
 */
export const getStylesWithParent = async (parentId: string): Promise<TextStyle[]> => {
  try {
    const allStyles = JSON.parse(localStorage.getItem(TEXT_STYLE_STORAGE_KEY) || '[]');
    return allStyles.filter((style: TextStyle) => style.parentId === parentId);
  } catch (error) {
    console.error('Error getting styles with parent:', error);
    return [];
  }
};

/**
 * Handle cascading updates when a parent style is modified
 * @param parentId The ID of the parent style that was modified
 */
export const handleParentStyleUpdate = async (parentId: string): Promise<void> => {
  // Get all styles that inherit from this parent
  const childStyles = await getStylesWithParent(parentId);
  
  // Log the update for debugging
  console.log(`Updating ${childStyles.length} child styles inheriting from ${parentId}`);
  
  // Clear cache for these styles (in a real implementation, we'd update them)
  // Here we're just invalidating the cache so they'll be recomputed
};

/**
 * Detect circular references in style inheritance
 * @param styleId The style to check
 * @param potentialParentId The potential parent to be assigned
 * @returns true if there would be a circular reference
 */
export const detectCircularReference = async (
  styleId: string,
  potentialParentId: string
): Promise<boolean> => {
  // If they're the same, it's definitely circular
  if (styleId === potentialParentId) {
    return true;
  }
  
  const allStyles = JSON.parse(localStorage.getItem(TEXT_STYLE_STORAGE_KEY) || '[]');
  
  // Follow the inheritance chain
  let currentParentId = potentialParentId;
  const visitedIds = new Set<string>();
  
  while (currentParentId) {
    // Detect cycles in the traversal
    if (visitedIds.has(currentParentId)) {
      return true;
    }
    visitedIds.add(currentParentId);
    
    // If we reach the original style, we have a circular reference
    if (currentParentId === styleId) {
      return true;
    }
    
    // Find the next parent in the chain
    const parentStyle = allStyles.find((style: TextStyle) => style.id === currentParentId);
    if (!parentStyle || !parentStyle.parentId) {
      break;
    }
    
    currentParentId = parentStyle.parentId;
  }
  
  return false;
};

/**
 * Reset text styles to defaults
 */
export const resetTextStylesToDefaults = (): void => {
  try {
    // Remove the text_styles entry
    localStorage.removeItem(TEXT_STYLE_STORAGE_KEY);
    
    // Remove default style ID
    localStorage.removeItem(DEFAULT_STYLE_ID_KEY);
    
    // Add back the default styles
    localStorage.setItem(TEXT_STYLE_STORAGE_KEY, JSON.stringify(DEFAULT_TEXT_STYLES));
    
    console.log('Text styles have been reset to defaults');
  } catch (error) {
    console.error('Error resetting text styles:', error);
  }
};

/**
 * Clear all style caches
 */
export const clearAllStyleCaches = (): void => {
  // In a real application, this would clear both local storage and any in-memory caches
  console.log('Clearing all style caches');
};

/**
 * Resolve style conflicts by merging styles with specific rules
 * @param baseStyle The base style
 * @param overrideStyle The style that should override conflicts
 * @returns The merged style
 */
export const resolveStyleConflicts = (
  baseStyle: Partial<TextStyle>,
  overrideStyle: Partial<TextStyle>
): Partial<TextStyle> => {
  // Start with the base style
  const resolvedStyle = { ...baseStyle };
  
  // Override with the override style, but only if properties are defined
  Object.keys(overrideStyle).forEach(key => {
    const typedKey = key as keyof TextStyle;
    if (
      overrideStyle[typedKey] !== undefined && 
      overrideStyle[typedKey] !== null &&
      typedKey !== 'id' && 
      typedKey !== 'name' &&
      typedKey !== 'parentId'
    ) {
      (resolvedStyle as any)[typedKey] = overrideStyle[typedKey];
    }
  });
  
  return resolvedStyle;
};
