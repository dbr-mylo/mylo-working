
import { TextStyle } from "@/lib/types";

export const generateCSSFromTextStyles = (styles: TextStyle[]): string => {
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
};
