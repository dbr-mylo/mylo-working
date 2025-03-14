
/**
 * Extracts page dimensions from CSS template styles
 */
export const extractDimensionsFromCSS = (css: string): { width: string; height: string } | undefined => {
  if (!css) return undefined;
  
  // Look for page size definitions in the CSS
  const widthMatch = css.match(/\.template-styled\s*{[^}]*width\s*:\s*([^;]+);/);
  const heightMatch = css.match(/\.template-styled\s*{[^}]*height\s*:\s*([^;]+);/);
  
  if (widthMatch?.[1] && heightMatch?.[1]) {
    return {
      width: widthMatch[1].trim(),
      height: heightMatch[1].trim()
    };
  }
  
  // If no explicit page dimensions in template, return default 8.5x11 dimensions
  return {
    width: '8.5in',
    height: '11in'
  };
};

/**
 * Generates CSS for template dimensions
 */
export const generateDimensionsCSS = (width: string = '8.5in', height: string = '11in'): string => {
  return `
.template-styled {
  width: ${width};
  height: ${height};
  min-height: ${height};
}
  `;
};
