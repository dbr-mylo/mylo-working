
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
}

const TEXT_STYLE_STORAGE_KEY = 'text_styles';

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
    description: 'Main heading style'
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
    description: 'Secondary heading style'
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
    description: 'Default paragraph style'
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
    description: 'Caption text style'
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
        description: style.description
      };
      
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
      
      if (existingIndex >= 0) {
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
      const filteredStyles = styles.filter(s => s.id !== id);
      localStorage.setItem(TEXT_STYLE_STORAGE_KEY, JSON.stringify(filteredStyles));
    } catch (error) {
      console.error('Error in deleteTextStyle:', error);
      throw error;
    }
  },
  
  generateCSSFromTextStyles(styles: TextStyle[]): string {
    return styles.map(style => {
      return `
${style.selector} {
  font-family: ${style.fontFamily};
  font-size: ${style.fontSize};
  font-weight: ${style.fontWeight};
  color: ${style.color};
  line-height: ${style.lineHeight};
  letter-spacing: ${style.letterSpacing};
}
      `.trim();
    }).join('\n\n');
  }
};

