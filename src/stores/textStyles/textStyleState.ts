
import { create } from 'zustand';
import { TextStyle } from "@/lib/types";
import { getLocalTextStyles, saveLocalTextStyle } from "./storage";
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_STYLE_ID_KEY } from "./constants";
import { FontUnit } from "@/lib/types/preferences";
import { getStyleWithInheritance, convertAllStylesToUnit, generateCSSFromTextStyles } from "./textStyleUtils";

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

// Create the store with Zustand
export const useTextStyleStore = create<TextStyleState>((set, get) => ({
  textStyles: [],

  // Get all text styles
  getTextStyles: async () => {
    try {
      const styles = getLocalTextStyles();
      set({ textStyles: styles });
      return styles;
    } catch (error) {
      console.error('Error in getTextStyles:', error);
      return [];
    }
  },

  // Get style with inheritance
  getStyleWithInheritance: async (styleId: string) => {
    try {
      const styles = getLocalTextStyles();
      return getStyleWithInheritance(styleId, styles);
    } catch (error) {
      console.error('Error in getStyleWithInheritance:', error);
      return null;
    }
  },

  // Convert all styles to a specific unit
  convertAllStylesToUnit: async (unit: FontUnit) => {
    try {
      const styles = getLocalTextStyles();
      const updatedStyles = convertAllStylesToUnit(styles, unit);
      
      // Save all updated styles
      localStorage.setItem('text_styles', JSON.stringify(updatedStyles));
      set({ textStyles: updatedStyles });
      
      console.log(`Converted all styles to ${unit}`);
    } catch (error) {
      console.error("Error converting text styles:", error);
      throw error;
    }
  },

  // Save a text style
  saveTextStyle: async (style: any) => {
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
      
      // Refresh the styles in the store
      get().getTextStyles();
      
      return style;
    } catch (error) {
      console.error("Error saving text style:", error);
      throw error;
    }
  },

  // Delete a text style
  deleteTextStyle: async (id: string) => {
    try {
      const styles = getLocalTextStyles();
      const updatedStyles = styles.filter(style => style.id !== id);
      localStorage.setItem('text_styles', JSON.stringify(updatedStyles));
      set({ textStyles: updatedStyles });
    } catch (error) {
      console.error("Error deleting text style:", error);
      throw error;
    }
  },

  // Duplicate a text style
  duplicateTextStyle: async (id: string) => {
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
      
      // Refresh the styles in the store
      get().getTextStyles();
      
      return newStyle;
    } catch (error) {
      console.error("Error duplicating text style:", error);
      throw error;
    }
  },

  // Set default style
  setDefaultStyle: async (id: string) => {
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
      
      set({ textStyles: updatedStyles });
    } catch (error) {
      console.error("Error setting default style:", error);
      throw error;
    }
  },

  // Update a text style
  updateTextStyle: async (id: string, updates: Partial<TextStyle>) => {
    try {
      const styles = getLocalTextStyles();
      const updatedStyles = styles.map(style => 
        style.id === id ? { ...style, ...updates, updated_at: new Date().toISOString() } : style
      );
      
      localStorage.setItem('text_styles', JSON.stringify(updatedStyles));
      set({ textStyles: updatedStyles });
    } catch (error) {
      console.error("Error updating text style:", error);
      throw error;
    }
  },

  // Add a new text style
  addTextStyle: async (textStyle: Omit<TextStyle, 'id'>) => {
    try {
      const newStyle: TextStyle = {
        ...textStyle,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      saveLocalTextStyle(newStyle);
      get().getTextStyles();
    } catch (error) {
      console.error("Error adding text style:", error);
      throw error;
    }
  },

  // Generate CSS from text styles
  generateCSSFromTextStyles: (styles: TextStyle[], currentUnit?: FontUnit) => {
    return generateCSSFromTextStyles(styles, currentUnit);
  }
}));
