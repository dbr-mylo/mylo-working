import { v4 as uuidv4 } from 'uuid';
import { TextStyle } from "@/lib/types";
import { getLocalTextStyles, saveLocalTextStyle } from "./storage";
import { DEFAULT_STYLE_ID_KEY } from "./constants";
import { FontUnit, convertFontSize, extractFontSizeValue } from "@/lib/types/preferences";

export interface SaveTextStyleInput {
  id?: string;
  name: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  lineHeight: string;
  letterSpacing: string;
  selector: string;
  description?: string;
  parentId?: string;
  isDefault?: boolean;
  isUsed?: boolean;
  textAlign?: string;
  textTransform?: string;
  textDecoration?: string;
  marginTop?: string;
  marginBottom?: string;
  customProperties?: Record<string, string>;
}

/**
 * Saves a text style to storage
 */
export const saveTextStyle = async (style: SaveTextStyleInput): Promise<TextStyle> => {
  try {
    const now = new Date().toISOString();
    
    // Get current font unit preference from stored styles
    const existingStyles = getLocalTextStyles();
    const defaultStyle = existingStyles.find(s => s.isDefault);
    const currentUnit: FontUnit = defaultStyle?.fontSize?.endsWith('pt') ? 'pt' : 'px';
    
    // Convert font size to current unit if needed
    let fontSize = style.fontSize;
    if (fontSize) {
      const { value, unit } = extractFontSizeValue(fontSize);
      if (unit !== currentUnit) {
        fontSize = convertFontSize(fontSize, unit, currentUnit);
      }
    }
    
    const styleToSave: TextStyle = {
      id: style.id || uuidv4(),
      name: style.name,
      fontFamily: style.fontFamily,
      fontSize: fontSize,
      fontWeight: style.fontWeight,
      color: style.color,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
      selector: style.selector,
      description: style.description,
      parentId: style.parentId,
      isDefault: style.isDefault || false,
      isUsed: style.isUsed !== undefined ? style.isUsed : false,
      textAlign: style.textAlign,
      textTransform: style.textTransform,
      textDecoration: style.textDecoration,
      marginTop: style.marginTop,
      marginBottom: style.marginBottom,
      customProperties: style.customProperties,
      updated_at: now,
      created_at: style.id ? undefined : now
    };
    
    // If this style is being set as default, update all other styles
    if (styleToSave.isDefault) {
      await setDefaultStyle(styleToSave.id);
    }
    
    // Save locally
    saveLocalTextStyle(styleToSave);
    
    console.log("Saved style with fontSize:", styleToSave.fontSize, "unit:", currentUnit);
    
    return styleToSave;
  } catch (error) {
    console.error('Error in saveTextStyle:', error);
    throw error;
  }
};

/**
 * Deletes a text style
 */
export const deleteTextStyle = async (id: string): Promise<void> => {
  try {
    const styles = getLocalTextStyles();
    
    // Check if the style is a system style - cannot delete system styles
    const styleToDelete = styles.find(s => s.id === id);
    if (styleToDelete?.isSystem) {
      throw new Error("Cannot delete a system style");
    }
    
    // Check if it's the default style
    if (styleToDelete?.isDefault) {
      throw new Error("Cannot delete the default style. Set another style as default first.");
    }
    
    // Check if any styles inherit from this one
    const childStyles = styles.filter(s => s.parentId === id);
    if (childStyles.length > 0) {
      throw new Error("Cannot delete a style that is used as a parent by other styles.");
    }
    
    const filteredStyles = styles.filter(s => s.id !== id);
    localStorage.setItem('text_styles', JSON.stringify(filteredStyles));
  } catch (error) {
    console.error('Error in deleteTextStyle:', error);
    throw error;
  }
};

/**
 * Creates a duplicate of an existing style
 */
export const duplicateTextStyle = async (id: string): Promise<TextStyle> => {
  try {
    const styles = getLocalTextStyles();
    const styleToDuplicate = styles.find(s => s.id === id);
    
    if (!styleToDuplicate) {
      throw new Error("Style not found");
    }
    
    // Create a new style based on the existing one
    const newStyle: TextStyle = {
      ...styleToDuplicate,
      id: uuidv4(),
      name: `${styleToDuplicate.name} (Copy)`,
      isDefault: false, // A copy is never the default
      isSystem: false,  // A copy is never a system style
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Save the duplicated style
    saveLocalTextStyle(newStyle);
    return newStyle;
  } catch (error) {
    console.error('Error in duplicateTextStyle:', error);
    throw error;
  }
};

/**
 * Sets a style as the default style
 */
export const setDefaultStyle = async (id: string): Promise<void> => {
  try {
    const styles = getLocalTextStyles();
    
    // Update the default flag on all styles
    const updatedStyles = styles.map(style => ({
      ...style,
      isDefault: style.id === id,
      updated_at: style.id === id ? new Date().toISOString() : style.updated_at
    }));
    
    localStorage.setItem('text_styles', JSON.stringify(updatedStyles));
    localStorage.setItem(DEFAULT_STYLE_ID_KEY, id);
  } catch (error) {
    console.error('Error in setDefaultStyle:', error);
    throw error;
  }
};
