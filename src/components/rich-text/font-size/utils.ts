
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

// Debounce timer reference
let fontSizeDebounceTimer: number | null = null;

/**
 * Dispatches a font size change event with debouncing and optional source information
 * @param fontSize - The font size value to broadcast
 * @param source - Source of the change (e.g., 'input', 'dom')
 * @param debounceTime - Debounce time in milliseconds (default: 100ms)
 */
export const dispatchFontSizeEvent = (
  fontSize: string, 
  source = 'input',
  debounceTime = 100
): void => {
  try {
    // Clear any existing timer
    if (fontSizeDebounceTimer !== null) {
      window.clearTimeout(fontSizeDebounceTimer);
    }
    
    // Set a new timer
    fontSizeDebounceTimer = window.setTimeout(() => {
      const event = new CustomEvent(FONT_SIZE_CHANGE_EVENT, {
        detail: { 
          fontSize, 
          source 
        }
      });
      document.dispatchEvent(event);
      fontSizeDebounceTimer = null;
    }, debounceTime);
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

/**
 * Validates a font size and returns information about its validity
 * @param size - The numeric font size to validate
 * @returns Object with validation info
 */
export const validateFontSize = (size: number): { 
  isValid: boolean;
  message: string | null;
  correctedSize?: number;
} => {
  // Check if size is NaN
  if (isNaN(size)) {
    return {
      isValid: false,
      message: "Please enter a valid number",
      correctedSize: MIN_FONT_SIZE
    };
  }
  
  // Check if size is too small
  if (size < MIN_FONT_SIZE) {
    return {
      isValid: false,
      message: `Minimum font size is ${MIN_FONT_SIZE}px`,
      correctedSize: MIN_FONT_SIZE
    };
  }
  
  // Check if size is too large
  if (size > MAX_FONT_SIZE) {
    return {
      isValid: false,
      message: `Maximum font size is ${MAX_FONT_SIZE}px`,
      correctedSize: MAX_FONT_SIZE
    };
  }
  
  // Font size is valid
  return {
    isValid: true,
    message: null
  };
};
