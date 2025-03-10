
import { getTextStyles, getLocalTextStyles, saveLocalTextStyle } from './storage';
import { generateCSSFromTextStyles } from './cssGenerator';
import { 
  saveTextStyle, 
  deleteTextStyle, 
  duplicateTextStyle, 
  setDefaultStyle,
  getDefaultStyle,
  getStylesWithParent,
  getStyleWithInheritance,
  SaveTextStyleInput
} from './styleOperations';
import { 
  clearCachedStylesByPattern, 
  clearDefaultResetStyle, 
  clearEditorCache,
  resetTextStylesToDefaults
} from './styleCache';

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
  getStyleWithInheritance,
  generateCSSFromTextStyles,
  clearCachedStylesByPattern,
  clearDefaultResetStyle,
  clearEditorCache,
  resetTextStylesToDefaults
};
