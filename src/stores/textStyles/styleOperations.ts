
import { v4 as uuidv4 } from 'uuid';
import { TextStyle } from "@/lib/types";
import { getLocalTextStyles, saveLocalTextStyle } from "./storage";
import { DEFAULT_STYLE_ID_KEY } from "./constants";

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
  textAlign?: string;
  textTransform?: string;
  textDecoration?: string;
  marginTop?: string;
  marginBottom?: string;
  customProperties?: Record<string, string>;
}

export const saveTextStyle = async (style: SaveTextStyleInput): Promise<TextStyle> => {
  try {
    const now = new Date().toISOString();
    const styleToSave: TextStyle = {
      id: style.id || uuidv4(),
      name: style.name,
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      color: style.color,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
      selector: style.selector,
      description: style.description,
      parentId: style.parentId,
      isDefault: style.isDefault || false,
      textAlign: style.textAlign,
      textTransform: style.textTransform,
      textDecoration: style.textDecoration,
      marginTop: style.marginTop,
      marginBottom: style.marginBottom,
      customProperties: style.customProperties,
      updated_at: now,
      created_at: style.id ? undefined : now // Only set created_at for new styles
    };
    
    // If this style is being set as default, update all other styles
    if (styleToSave.isDefault) {
      await setDefaultStyle(styleToSave.id);
    }
    
    // Save locally for now
    saveLocalTextStyle(styleToSave);
    return styleToSave;
  } catch (error) {
    console.error('Error in saveTextStyle:', error);
    throw error;
  }
};

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
    
    const filteredStyles = styles.filter(s => s.id !== id);
    localStorage.setItem('text_styles', JSON.stringify(filteredStyles));
  } catch (error) {
    console.error('Error in deleteTextStyle:', error);
    throw error;
  }
};

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

export const getDefaultStyle = async (): Promise<TextStyle | null> => {
  try {
    const styles = getLocalTextStyles();
    return styles.find(s => s.isDefault) || null;
  } catch (error) {
    console.error('Error in getDefaultStyle:', error);
    return null;
  }
};

export const getStylesWithParent = async (parentId: string): Promise<TextStyle[]> => {
  try {
    const styles = getLocalTextStyles();
    return styles.filter(s => s.parentId === parentId);
  } catch (error) {
    console.error('Error in getStylesWithParent:', error);
    return [];
  }
};
