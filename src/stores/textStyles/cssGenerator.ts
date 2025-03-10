
import { TextStyle } from "@/lib/types";
import { FontUnit, convertFontSize, extractFontSizeValue } from "@/lib/types/preferences";

export const generateCSSFromTextStyles = (styles: TextStyle[], fontUnit?: FontUnit): string => {
  return styles.map(style => {
    // Convert font size to the current unit preference if specified
    const fontSize = fontUnit 
      ? convertFontSizeToUnit(style.fontSize, fontUnit)
      : style.fontSize;
    
    console.log(`Converting style ${style.name} fontSize from ${style.fontSize} to ${fontSize}`);
    
    let css = `
${style.selector} {
  font-family: ${style.fontFamily};
  font-size: ${fontSize};
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
};

// Helper function to convert font size to a specific unit
const convertFontSizeToUnit = (fontSize: string, targetUnit: FontUnit): string => {
  // Always ensure input has a unit
  if (!fontSize.match(/\d+(px|pt)$/)) {
    fontSize = `${fontSize}px`; // Default to px
  }
  
  const { value, unit } = extractFontSizeValue(fontSize);
  if (unit === targetUnit) return fontSize;
  return convertFontSize(fontSize, unit, targetUnit);
};
