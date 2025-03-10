import { create } from 'zustand';
import { TextStyle } from "@/lib/types";
import { getLocalTextStyles, saveLocalTextStyle } from "./storage";
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_STYLE_ID_KEY } from "./constants";
import { convertFontSize, extractFontSizeValue, FontUnit } from "@/lib/types/preferences";

interface TextStyleState {
  textStyles: TextStyle[];
  addTextStyle: (textStyle: Omit<TextStyle, 'id'>) => void;
  deleteTextStyle: (id: string) => void;
  updateTextStyle: (id: string, updates: Partial<TextStyle>) => void;
  getTextStyles: () => Promise<TextStyle[]>;
  getStyleWithInheritance: (styleId: string) => Promise<TextStyle>;
  convertAllStylesToUnit: (unit: FontUnit) => Promise<void>;
}

class TextStyleStore {
  /**
   * Get all text styles from local storage
   */
  async getTextStyles(): Promise<TextStyle[]> {
    try {
      const styles = getLocalTextStyles();
      return styles;
    } catch (error) {
      console.error('Error in getTextStyles:', error);
      return [];
    }
  }

  /**
   * Get a text style by ID, including inherited properties from parent styles
   */
  async getStyleWithInheritance(styleId: string): Promise<TextStyle> {
    try {
      const styles = getLocalTextStyles();
      let style = styles.find(s => s.id === styleId);
      
      if (!style) {
        console.warn(`Style with ID ${styleId} not found`);
        return null;
      }
      
      // If the style has a parent, merge the parent's properties
      if (style.parentId) {
        let parentStyle = styles.find(s => s.id === style.parentId);
        
        // Go up the chain to find the root parent
        while (parentStyle && parentStyle.parentId) {
          parentStyle = styles.find(s => s.id === parentStyle.parentId);
        }
        
        if (parentStyle) {
          style = {
            ...parentStyle,
            ...style,
            id: style.id, // Ensure the original ID is preserved
            name: style.name, // Ensure the original name is preserved
          };
        }
      }
      
      return style;
    } catch (error) {
      console.error('Error in getStyleWithInheritance:', error);
      return null;
    }
  }

  /**
   * Convert all text styles to a specific unit
   */
  async convertAllStylesToUnit(unit: FontUnit): Promise<void> {
    try {
      const styles = getLocalTextStyles();
      
      // Convert all styles to the new unit
      const updatedStyles = styles.map(style => {
        if (style.fontSize) {
          const { value, unit: currentUnit } = extractFontSizeValue(style.fontSize);
          if (currentUnit !== unit) {
            style.fontSize = convertFontSize(style.fontSize, currentUnit, unit);
          }
        }
        return style;
      });
      
      // Save all updated styles
      localStorage.setItem('text_styles', JSON.stringify(updatedStyles));
      
      console.log(`Converted all styles to ${unit}`);
    } catch (error) {
      console.error("Error converting text styles:", error);
      throw error;
    }
  }
}

export const textStyleStore = new TextStyleStore();
