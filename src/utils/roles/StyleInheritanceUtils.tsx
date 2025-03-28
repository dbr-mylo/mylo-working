import { TextStyle } from "@/lib/types";

/**
 * Utility functions for style inheritance management
 */

/**
 * Checks if a potential parent style would create a circular dependency
 * @param potentialParentId The ID of the style that would be the parent
 * @param childStyleId The ID of the style that would be the child
 * @param allStyles All available styles
 * @param visited Optional set of already visited style IDs to prevent infinite recursion
 * @returns true if adding this parent would create a circular dependency
 */
export const wouldCreateCircularDependency = (
  potentialParentId: string,
  childStyleId: string,
  allStyles: TextStyle[],
  visited: Set<string> = new Set()
): boolean => {
  // If we've already checked this style, we have a circular reference
  if (visited.has(potentialParentId)) {
    return true;
  }
  
  // Add this style to the visited set
  visited.add(potentialParentId);
  
  // Find the potential parent style
  const style = allStyles.find(s => s.id === potentialParentId);
  
  // If the style doesn't exist or doesn't have a parent, no circular dependency
  if (!style || !style.parentId) {
    return false;
  }
  
  // If the parent's parent is the child, we have a circular dependency
  if (style.parentId === childStyleId) {
    return true;
  }
  
  // Check the parent's parent recursively
  return wouldCreateCircularDependency(style.parentId, childStyleId, allStyles, visited);
};

/**
 * Filters out styles that would create circular dependencies if used as parents
 * @param allStyles All available styles
 * @param styleId The ID of the current style being edited
 * @returns A filtered list of styles that can safely be used as parents
 */
export const filterValidParentStyles = (allStyles: TextStyle[], styleId?: string): TextStyle[] => {
  if (!styleId) return allStyles;
  
  return allStyles.filter(style => 
    style.id !== styleId && 
    !wouldCreateCircularDependency(style.id, styleId, allStyles)
  );
};

/**
 * Creates a simpler version of the inheritance chain for visualization
 * @param inheritanceChain The full inheritance chain of styles
 * @returns A simplified array of just the names and IDs
 */
export const simplifyInheritanceChain = (inheritanceChain: TextStyle[]): Array<{id: string, name: string}> => {
  return inheritanceChain.map(style => ({
    id: style.id,
    name: style.name
  }));
};

/**
 * Calculates the effective styling properties based on inheritance
 * @param style The base style
 * @param inheritedStyles Array of parent styles in order of inheritance
 * @returns A combined style with all properties resolved
 */
export const calculateEffectiveStyle = (
  style: TextStyle, 
  inheritedStyles: TextStyle[]
): TextStyle => {
  // Start with an empty style object
  let effectiveStyle: Partial<TextStyle> = { ...style };
  
  // Apply each inherited style in reverse order (from most distant ancestor to closest)
  [...inheritedStyles].reverse().forEach(parentStyle => {
    // Skip id, name, and parentId - we want to keep the original style's metadata
    const { id, name, parentId, ...styleProperties } = parentStyle;
    
    // Apply parent properties for any property not explicitly set in the child
    Object.entries(styleProperties).forEach(([key, value]) => {
      if (value !== undefined && effectiveStyle[key as keyof TextStyle] === undefined) {
        effectiveStyle[key as keyof TextStyle] = value as any;
      }
    });
  });
  
  return effectiveStyle as TextStyle;
};
