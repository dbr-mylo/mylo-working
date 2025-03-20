
import { TextStyle } from '@/lib/types';
import { getTextStyles } from './storage';

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
  
  // Recursively get the parent styles
  const parentChain = await getInheritanceChain(style.parentId);
  
  // Return the chain with the current style first, followed by parent chain
  return [...chain, ...parentChain];
};
