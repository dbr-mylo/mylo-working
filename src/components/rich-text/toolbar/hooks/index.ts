
// Re-export hooks for central access
export { useFontSizeTracking } from './useFontSizeTracking';
export { useEditorFontSizeState } from './useEditorFontSizeState';
export { useFontSizeEventHandling } from './useFontSizeEventHandling';
export { useToolbarInitialization } from './useToolbarInitialization';

// Re-export utility functions
export { getDomFontSize } from './utils/domFontSizeUtils';

// Import and re-export from font-size module to avoid duplication
export { useDomFontSizeDetection } from '../../font-size/hooks/useDomFontSizeDetection';
