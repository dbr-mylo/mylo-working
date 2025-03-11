
// Re-export hooks for easier imports
export * from './useFontSizeEventHandling';
export * from './useFontSizeTracking';
export * from './useEditorFontSizeState';

// Note: useDomFontSizeDetection was moved to utils/domFontSizeUtils.ts
// We re-export it from there
export { getDomFontSize } from './utils/domFontSizeUtils';
