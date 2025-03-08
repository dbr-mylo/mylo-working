
// This file now re-exports everything from the operations directory
// to maintain backward compatibility

import { 
  SaveTextStyleInput,
  saveTextStyle,
  deleteTextStyle,
  duplicateTextStyle,
  setDefaultStyle,
  getDefaultStyle,
  getStylesWithParent,
  getStyleWithInheritance
} from './operations';

export type { SaveTextStyleInput };

export {
  saveTextStyle,
  deleteTextStyle,
  duplicateTextStyle,
  setDefaultStyle,
  getDefaultStyle,
  getStylesWithParent,
  getStyleWithInheritance
};
