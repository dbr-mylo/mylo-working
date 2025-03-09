
import { TextStyle } from "@/lib/types";
import { getLocalTextStyles } from "./storage";

/**
 * Gets a style with all properties inherited from parent styles
 */
export const getStyleWithInheritance = async (styleId: string): Promise<TextStyle | null> => {
  try {
    const styles = getLocalTextStyles();
    const style = styles.find(s => s.id === styleId);
    
    if (!style) {
      console.error('Style not found:', styleId);
      return null;
    }
    
    // If this style doesn't inherit from a parent, return it as is
    if (!style.parentId) {
      console.log('Style has no parent, returning as is:', style.name);
      return style;
    }
    
    // Get the parent style with its inherited properties
    const parentStyle = await getStyleWithInheritance(style.parentId);
    
    if (!parentStyle) {
      console.warn('Parent style not found, returning child as is');
      return style;
    }
    
    console.log(`Merging style ${style.name} with parent ${parentStyle.name}`);
    
    // Create a new style object that combines the parent's properties with this style's overrides
    const combinedStyle: TextStyle = {
      ...parentStyle,
      ...style,
      // Keep the original ID, name, selector, and description
      id: style.id,
      name: style.name,
      selector: style.selector,
      description: style.description,
      isDefault: style.isDefault,
      isSystem: style.isSystem,
      isUsed: style.isUsed,
      created_at: style.created_at,
      updated_at: style.updated_at
    };
    
    return combinedStyle;
  } catch (error) {
    console.error('Error in getStyleWithInheritance:', error);
    return null;
  }
};
