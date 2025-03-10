
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
  saveTextStyle: (style: any) => Promise<TextStyle>;
  duplicateTextStyle: (id: string) => Promise<TextStyle>;
  setDefaultStyle: (id: string) => Promise<void>;
  generateCSSFromTextStyles: (styles: TextStyle[], currentUnit?: FontUnit) => string;
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

  /**
   * Save a text style to local storage
   */
  async saveTextStyle(style: any): Promise<TextStyle> {
    try {
      // Generate an ID if one doesn't exist
      if (!style.id) {
        style.id = uuidv4();
      }
      
      // Set created_at if it's a new style
      if (!style.created_at) {
        style.created_at = new Date().toISOString();
      }
      
      // Update the updated_at timestamp
      style.updated_at = new Date().toISOString();
      
      // Save the style to localStorage
      saveLocalTextStyle(style);
      
      return style;
    } catch (error) {
      console.error("Error saving text style:", error);
      throw error;
    }
  }

  /**
   * Delete a text style from local storage
   */
  async deleteTextStyle(id: string): Promise<void> {
    try {
      const styles = getLocalTextStyles();
      const updatedStyles = styles.filter(style => style.id !== id);
      localStorage.setItem('text_styles', JSON.stringify(updatedStyles));
    } catch (error) {
      console.error("Error deleting text style:", error);
      throw error;
    }
  }

  /**
   * Duplicate a text style
   */
  async duplicateTextStyle(id: string): Promise<TextStyle> {
    try {
      const styles = getLocalTextStyles();
      const styleToClone = styles.find(style => style.id === id);
      
      if (!styleToClone) {
        throw new Error(`Style with ID ${id} not found`);
      }
      
      const newStyle: TextStyle = {
        ...styleToClone,
        id: uuidv4(),
        name: `${styleToClone.name} (Copy)`,
        isDefault: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Save the new style
      saveLocalTextStyle(newStyle);
      
      return newStyle;
    } catch (error) {
      console.error("Error duplicating text style:", error);
      throw error;
    }
  }

  /**
   * Set a text style as the default
   */
  async setDefaultStyle(id: string): Promise<void> {
    try {
      const styles = getLocalTextStyles();
      
      // Reset all isDefault flags
      const updatedStyles = styles.map(style => ({
        ...style,
        isDefault: style.id === id
      }));
      
      // Save to localStorage
      localStorage.setItem('text_styles', JSON.stringify(updatedStyles));
      
      // Also store the default style ID in a separate key for quick access
      localStorage.setItem(DEFAULT_STYLE_ID_KEY, id);
    } catch (error) {
      console.error("Error setting default style:", error);
      throw error;
    }
  }

  /**
   * Generate CSS from text styles
   */
  generateCSSFromTextStyles(styles: TextStyle[], currentUnit?: FontUnit): string {
    let css = '';
    
    styles.forEach(style => {
      if (!style.selector) return;
      
      let fontSize = style.fontSize;
      if (currentUnit && fontSize) {
        const { unit } = extractFontSizeValue(fontSize);
        if (unit !== currentUnit) {
          fontSize = convertFontSize(fontSize, unit, currentUnit);
        }
      }
      
      css += `[data-style-id="${style.id}"] {\n`;
      if (style.fontFamily) css += `  font-family: ${style.fontFamily};\n`;
      if (fontSize) css += `  font-size: ${fontSize};\n`;
      if (style.fontWeight) css += `  font-weight: ${style.fontWeight};\n`;
      if (style.color) css += `  color: ${style.color};\n`;
      if (style.lineHeight) css += `  line-height: ${style.lineHeight};\n`;
      if (style.letterSpacing) css += `  letter-spacing: ${style.letterSpacing};\n`;
      if (style.textAlign) css += `  text-align: ${style.textAlign};\n`;
      if (style.textTransform) css += `  text-transform: ${style.textTransform};\n`;
      if (style.textDecoration) css += `  text-decoration: ${style.textDecoration};\n`;
      if (style.marginTop) css += `  margin-top: ${style.marginTop};\n`;
      if (style.marginBottom) css += `  margin-bottom: ${style.marginBottom};\n`;
      
      // Add any custom properties
      if (style.customProperties) {
        Object.entries(style.customProperties).forEach(([key, value]) => {
          css += `  ${key}: ${value};\n`;
        });
      }
      
      css += '}\n\n';
    });
    
    return css;
  }
}

export const textStyleStore = new TextStyleStore();
