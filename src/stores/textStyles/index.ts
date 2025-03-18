
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
import { 
  getStyleWithInheritance,
  getInheritanceChain,
  validateParentAssignment,
  handleStyleDeletion,
  resolveInheritanceConflicts 
} from './styleInheritance';
import { 
  clearCachedStylesByPattern, 
  addVersionTracking,
  resetTextStylesToDefaults,
  clearAllStyleCaches,
  detectCircularReference,
  resolveStyleConflicts
} from './styleCache';

// Re-export the SaveTextStyleInput interface
export type { SaveTextStyleInput };

// Create and export the consolidated textStyleStore
export const textStyleStore = {
  // Basic storage operations
  getTextStyles,
  getLocalTextStyles,
  saveTextStyle,
  saveLocalTextStyle,
  deleteTextStyle,
  duplicateTextStyle,
  
  // Style default management
  setDefaultStyle,
  getDefaultStyle,
  
  // Style inheritance
  getStylesWithParent,
  getStyleWithInheritance,
  getInheritanceChain,
  validateParentAssignment,
  handleStyleDeletion,
  resolveInheritanceConflicts,
  
  // CSS generation
  generateCSSFromTextStyles,
  
  // Cache and versioning
  clearCachedStylesByPattern,
  addVersionTracking,
  resetTextStylesToDefaults,
  clearAllStyleCaches,
  detectCircularReference,
  resolveStyleConflicts
};
