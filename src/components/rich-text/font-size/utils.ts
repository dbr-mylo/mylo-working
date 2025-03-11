
import { MIN_FONT_SIZE, MAX_FONT_SIZE, FONT_SIZE_CHANGE_EVENT } from './constants';

/**
 * Extracts a numeric value from a font size string
 * @param value - Font size string (e.g., "16px", "1.5rem", "20")
 * @param defaultValue - Default value to return if parsing fails
 * @returns The numeric value extracted from the string
 */
export const parseFontSize = (value: string, defaultValue = 16): number => {
  if (!value) return defaultValue;
  const match = String(value).match(/^(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : defaultValue;
};

/**
 * Formats a numeric value to a font size string with "px" units
 * @param value - Numeric font size value
 * @returns Formatted font size string (e.g., "16px")
 */
export const formatFontSize = (value: number): string => {
  return `${value}px`;
};

/**
 * Dispatches a font size change event with optional source information
 * @param fontSize - The font size value to broadcast
 * @param source - Source of the change (e.g., 'input', 'dom')
 */
export const dispatchFontSizeEvent = (fontSize: string, source = 'input'): void => {
  try {
    const event = new CustomEvent(FONT_SIZE_CHANGE_EVENT, {
      detail: { 
        fontSize, 
        source 
      }
    });
    document.dispatchEvent(event);
  } catch (error) {
    console.error("Error dispatching font size event:", error);
  }
};

/**
 * Clamps a value between minimum and maximum bounds
 * @param value - The value to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns The clamped value
 */
export const clampFontSize = (value: number, min = MIN_FONT_SIZE, max = MAX_FONT_SIZE): number => {
  return Math.max(Math.min(value, max), min);
};
