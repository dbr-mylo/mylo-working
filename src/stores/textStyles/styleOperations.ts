
// Re-export everything from the separate modules
export type { SaveTextStyleInput } from './styleManagement';
export { saveTextStyle, deleteTextStyle, duplicateTextStyle, setDefaultStyle } from './styleManagement';
export { getDefaultStyle, getStylesWithParent } from './utils';
export { getStyleWithInheritance } from './styleInheritance';
