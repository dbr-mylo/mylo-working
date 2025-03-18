
import { TextStyle } from '@/lib/types';
import { getTextStyles } from './storage';
import { detectCircularReference, resolveStyleConflicts } from './styleCache';

/**
 * Gets a text style with all properties from its inheritance chain applied
 * @param styleId The ID of the style to get
 * @returns The style with inherited properties
 */
export const getStyleWithInheritance = async (styleId: string): Promise<TextStyle | null> => {
  const textStyles = await getTextStyles();
  const style = textStyles.find(s => s.id === styleId);
  
  if (!style) return null;
  
  // If the style has no parent, return it as is
  if (!style.parentId) return style;
  
  // Get the parent style
  const parent = await getStyleWithInheritance(style.parentId);
  if (!parent) return style;
  
  // Merge the parent style with the current style, with current style taking precedence
  return {
    ...parent,
    ...style,
    id: style.id, // Ensure we keep the correct ID
    name: style.name, // Ensure we keep the correct name
    parentId: style.parentId, // Ensure we keep the parent reference
  };
};

/**
 * Gets the entire inheritance chain for a style
 * @param styleId The ID of the style to get the inheritance chain for
 * @returns An array of styles in the inheritance chain, from the current style to the root
 */
export const getInheritanceChain = async (styleId: string): Promise<TextStyle[]> => {
  const textStyles = await getTextStyles();
  const style = textStyles.find(s => s.id === styleId);
  
  if (!style) return [];
  
  // Start with the current style
  const chain: TextStyle[] = [style];
  
  // If the style has no parent, return just the current style
  if (!style.parentId) return chain;
  
  // Maintain a set of visited style IDs to avoid circular references
  const visitedStyleIds = new Set<string>([style.id]);
  
  let currentParentId = style.parentId;
  
  // Recursively get the parent styles while avoiding circular references
  while (currentParentId) {
    // Check for circular reference
    if (visitedStyleIds.has(currentParentId)) {
      console.warn(`Circular reference detected in style inheritance chain for ${styleId}`);
      break;
    }
    
    visitedStyleIds.add(currentParentId);
    
    const parentStyle = textStyles.find(s => s.id === currentParentId);
    if (!parentStyle) break;
    
    chain.push(parentStyle);
    currentParentId = parentStyle.parentId;
  }
  
  return chain;
};

/**
 * Validates that setting a parent ID won't create a circular reference
 * @param styleId The ID of the style being updated
 * @param newParentId The ID of the new parent style
 * @throws Error if setting the parent would create a circular reference
 */
export const validateParentAssignment = async (
  styleId: string,
  newParentId: string
): Promise<void> => {
  const hasCircularReference = await detectCircularReference(styleId, newParentId);
  
  if (hasCircularReference) {
    throw new Error("Cannot set parent: would create a circular reference");
  }
};

/**
 * Handles cascading updates when a style is deleted
 * @param styleId The ID of the style being deleted
 */
export const handleStyleDeletion = async (styleId: string): Promise<void> => {
  const textStyles = await getTextStyles();
  
  // Find all styles that have this style as a parent
  const childStyles = textStyles.filter(s => s.parentId === styleId);
  
  // Update child styles to remove the parent reference
  for (const childStyle of childStyles) {
    console.log(`Updating child style ${childStyle.name} to remove deleted parent ${styleId}`);
    // In a real implementation, you'd update the child styles here
    // This is just a placeholder for the implementation
  }
};

/**
 * Resolves inheritance conflicts by applying a set of rules
 * @param style The style to resolve conflicts for
 * @returns The style with resolved conflicts
 */
export const resolveInheritanceConflicts = async (styleId: string): Promise<TextStyle | null> => {
  const chain = await getInheritanceChain(styleId);
  
  if (chain.length === 0) return null;
  
  // Start with an empty style
  let resolvedStyle: Partial<TextStyle> = {};
  
  // Apply styles from the inheritance chain in reverse order (from root to leaf)
  // This ensures that child styles override parent styles
  for (let i = chain.length - 1; i >= 0; i--) {
    resolvedStyle = resolveStyleConflicts(resolvedStyle, chain[i]);
  }
  
  return resolvedStyle as TextStyle;
};
