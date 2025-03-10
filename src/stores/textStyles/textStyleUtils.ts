
import { TextStyle } from "@/lib/types";
import { convertFontSize, extractFontSizeValue, FontUnit } from "@/lib/types/preferences";

/**
 * Get a text style with all inherited properties from parent styles
 */
export const getStyleWithInheritance = async (styleId: string, styles: TextStyle[]): Promise<TextStyle> => {
  try {
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
};

/**
 * Convert all text styles to a specific unit
 */
export const convertAllStylesToUnit = (styles: TextStyle[], unit: FontUnit): TextStyle[] => {
  // Convert all styles to the new unit
  return styles.map(style => {
    if (style.fontSize) {
      const { value, unit: currentUnit } = extractFontSizeValue(style.fontSize);
      if (currentUnit !== unit) {
        style.fontSize = convertFontSize(style.fontSize, currentUnit, unit);
      }
    }
    return style;
  });
};

/**
 * Generate CSS from text styles
 */
export const generateCSSFromTextStyles = (styles: TextStyle[], currentUnit?: FontUnit): string => {
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
};
