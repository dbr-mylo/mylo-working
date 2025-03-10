
export interface TemplatePreferences {
  typography: {
    fontUnit: FontUnit;
  };
}

export type FontUnit = 'px' | 'pt';

// Conversion values
export const POINT_TO_PIXEL_RATIO = 1.333;
export const PIXEL_TO_POINT_RATIO = 0.75;

// Helper functions for font unit conversion
export const convertPixelsToPoints = (pixels: number): number => {
  return Math.round((pixels * PIXEL_TO_POINT_RATIO) * 10) / 10;
};

export const convertPointsToPixels = (points: number): number => {
  return Math.round((points * POINT_TO_PIXEL_RATIO) * 10) / 10;
};

export const convertFontSize = (value: string, fromUnit: FontUnit, toUnit: FontUnit): string => {
  if (fromUnit === toUnit) return value;
  
  const numValue = parseFloat(value.replace(fromUnit, ''));
  
  if (fromUnit === 'px' && toUnit === 'pt') {
    return `${convertPixelsToPoints(numValue)}pt`;
  } else if (fromUnit === 'pt' && toUnit === 'px') {
    return `${convertPointsToPixels(numValue)}px`;
  }
  
  return value;
};

export const extractFontSizeValue = (fontSize: string): { value: number, unit: FontUnit } => {
  const match = fontSize.match(/^([\d.]+)(px|pt)$/);
  if (match) {
    return {
      value: parseFloat(match[1]),
      unit: match[2] as FontUnit
    };
  }
  
  // Default fallback
  return {
    value: parseFloat(fontSize) || 16,
    unit: 'px'
  };
};

