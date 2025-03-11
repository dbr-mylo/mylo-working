
// Re-export hooks for easier imports
export * from './useFontSizeEventHandling';
export * from './useFontSizeTracking';
export * from './useEditorFontSizeState';

// Re-export utils 
export { getDomFontSize } from './utils/domFontSizeUtils';

// Import and re-export from font-size module to avoid duplication
export { useDomFontSizeDetection } from '../../font-size/hooks/useDomFontSizeDetection';
