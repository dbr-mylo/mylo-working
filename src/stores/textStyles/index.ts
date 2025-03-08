
import { getTextStyles, getLocalTextStyles, saveLocalTextStyle } from './storage';
import { generateCSSFromTextStyles } from './cssGenerator';
import { 
  saveTextStyle, 
  deleteTextStyle, 
  duplicateTextStyle, 
  setDefaultStyle,
  getDefaultStyle,
  getStylesWithParent,
  SaveTextStyleInput
} from './styleOperations';

// Re-export the SaveTextStyleInput interface
export type { SaveTextStyleInput };

// Create and export the consolidated textStyleStore
export const textStyleStore = {
  getTextStyles,
  getLocalTextStyles,
  saveTextStyle,
  saveLocalTextStyle,
  deleteTextStyle,
  duplicateTextStyle,
  setDefaultStyle,
  getDefaultStyle,
  getStylesWithParent,
  generateCSSFromTextStyles
};
