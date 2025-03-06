
export const rgbToHex = (rgb: string): string => {
  // Handle if it's already a hex value
  if (rgb.startsWith("#")) return rgb;
  
  // Extract rgb values
  const rgbMatch = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!rgbMatch) return "#000000";
  
  const r = parseInt(rgbMatch[1]);
  const g = parseInt(rgbMatch[2]);
  const b = parseInt(rgbMatch[3]);
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};
