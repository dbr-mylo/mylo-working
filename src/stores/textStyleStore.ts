
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { TextStyle } from "@/lib/types";

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

const TEXT_STYLE_STORAGE_KEY = 'text_styles';
const DEFAULT_STYLE_ID_KEY = 'default_text_style_id';

// Default text styles that will be available
const DEFAULT_TEXT_STYLES: TextStyle[] = [
  {
    id: 'heading-1',
    name: 'Heading 1',
    fontFamily: 'Playfair Display',
    fontSize: '32px',
    fontWeight: '700',
    color: '#1A1F2C',
    lineHeight: '1.2',
    letterSpacing: '0',
    selector: 'h1',
    description: 'Main heading style',
    isSystem: true,
    isDefault: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'heading-2',
    name: 'Heading 2',
    fontFamily: 'Playfair Display',
    fontSize: '24px',
    fontWeight: '700',
    color: '#1A1F2C',
    lineHeight: '1.3',
    letterSpacing: '0',
    selector: 'h2',
    description: 'Secondary heading style',
    isSystem: true,
    isDefault: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'body',
    name: 'Body Text',
    fontFamily: 'Inter',
    fontSize: '16px',
    fontWeight: '400',
    color: '#333333',
    lineHeight: '1.5',
    letterSpacing: '0',
    selector: 'p',
    description: 'Default paragraph style',
    isSystem: true,
    isDefault: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'caption',
    name: 'Caption',
    fontFamily: 'Inter',
    fontSize: '14px',
    fontWeight: '400',
    color: '#666666',
    lineHeight: '1.4',
    letterSpacing: '0.5px',
    selector: '.caption',
    description: 'Caption text style',
    isSystem: true,
    isDefault: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const textStyleStore = {
  async getTextStyles(): Promise<TextStyle[]> {
    try {
      // For authenticated designers, fetch from Supabase (future implementation)
      const { data: session } = await supabase.auth.getSession();
      if (session.session?.user) {
        // This would connect to a Supabase table in the future
        // For now, just use localStorage
        return this.getLocalTextStyles();
      }
      
      // For guest designers, fetch from localStorage
      return this.getLocalTextStyles();
    } catch (error) {
      console.error('Error in getTextStyles:', error);
      return this.getLocalTextStyles();
    }
  },
  
  getLocalTextStyles(): TextStyle[] {
    try {
      const stylesJSON = localStorage.getItem(TEXT_STYLE_STORAGE_KEY);
      if (stylesJSON) {
        return JSON.parse(stylesJSON);
      } else {
        // Initialize with default styles if none exist
        localStorage.setItem(TEXT_STYLE_STORAGE_KEY, JSON.stringify(DEFAULT_TEXT_STYLES));
        return DEFAULT_TEXT_STYLES;
      }
    } catch (error) {
      console.error('Error parsing text styles from localStorage:', error);
      return DEFAULT_TEXT_STYLES;
    }
  },
  
  async saveTextStyle(style: SaveTextStyleInput): Promise<TextStyle> {
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
        await this.setDefaultStyle(styleToSave.id);
      }
      
      // Save locally for now
      this.saveLocalTextStyle(styleToSave);
      return styleToSave;
    } catch (error) {
      console.error('Error in saveTextStyle:', error);
      throw error;
    }
  },
  
  saveLocalTextStyle(style: TextStyle): void {
    try {
      const styles = this.getLocalTextStyles();
      const existingIndex = styles.findIndex(s => s.id === style.id);
      
      // Update or add the style
      if (existingIndex >= 0) {
        // Preserve the created_at date and isSystem flag if they exist
        const existingStyle = styles[existingIndex];
        style.created_at = existingStyle.created_at;
        style.isSystem = existingStyle.isSystem;
        styles[existingIndex] = style;
      } else {
        styles.push(style);
      }
      
      localStorage.setItem(TEXT_STYLE_STORAGE_KEY, JSON.stringify(styles));
    } catch (error) {
      console.error('Error saving text style to localStorage:', error);
      throw error;
    }
  },
  
  async deleteTextStyle(id: string): Promise<void> {
    try {
      const styles = this.getLocalTextStyles();
      
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
      localStorage.setItem(TEXT_STYLE_STORAGE_KEY, JSON.stringify(filteredStyles));
    } catch (error) {
      console.error('Error in deleteTextStyle:', error);
      throw error;
    }
  },
  
  async duplicateTextStyle(id: string): Promise<TextStyle> {
    try {
      const styles = this.getLocalTextStyles();
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
      this.saveLocalTextStyle(newStyle);
      return newStyle;
    } catch (error) {
      console.error('Error in duplicateTextStyle:', error);
      throw error;
    }
  },
  
  async setDefaultStyle(id: string): Promise<void> {
    try {
      const styles = this.getLocalTextStyles();
      
      // Update the default flag on all styles
      const updatedStyles = styles.map(style => ({
        ...style,
        isDefault: style.id === id,
        updated_at: style.id === id ? new Date().toISOString() : style.updated_at
      }));
      
      localStorage.setItem(TEXT_STYLE_STORAGE_KEY, JSON.stringify(updatedStyles));
      localStorage.setItem(DEFAULT_STYLE_ID_KEY, id);
    } catch (error) {
      console.error('Error in setDefaultStyle:', error);
      throw error;
    }
  },
  
  async getDefaultStyle(): Promise<TextStyle | null> {
    try {
      const styles = this.getLocalTextStyles();
      return styles.find(s => s.isDefault) || null;
    } catch (error) {
      console.error('Error in getDefaultStyle:', error);
      return null;
    }
  },
  
  async getStylesWithParent(parentId: string): Promise<TextStyle[]> {
    try {
      const styles = this.getLocalTextStyles();
      return styles.filter(s => s.parentId === parentId);
    } catch (error) {
      console.error('Error in getStylesWithParent:', error);
      return [];
    }
  },
  
  generateCSSFromTextStyles(styles: TextStyle[]): string {
    return styles.map(style => {
      let css = `
${style.selector} {
  font-family: ${style.fontFamily};
  font-size: ${style.fontSize};
  font-weight: ${style.fontWeight};
  color: ${style.color};
  line-height: ${style.lineHeight};
  letter-spacing: ${style.letterSpacing};`;
      
      // Add optional properties if they exist
      if (style.textAlign) css += `\n  text-align: ${style.textAlign};`;
      if (style.textTransform) css += `\n  text-transform: ${style.textTransform};`;
      if (style.textDecoration) css += `\n  text-decoration: ${style.textDecoration};`;
      if (style.marginTop) css += `\n  margin-top: ${style.marginTop};`;
      if (style.marginBottom) css += `\n  margin-bottom: ${style.marginBottom};`;
      
      // Add any custom properties
      if (style.customProperties) {
        Object.entries(style.customProperties).forEach(([property, value]) => {
          css += `\n  ${property}: ${value};`;
        });
      }
      
      css += '\n}';
      return css.trim();
    }).join('\n\n');
  }
};
