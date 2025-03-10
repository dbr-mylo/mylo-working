
/**
 * Constants related to font size functionality
 */

/** Minimum allowed font size */
export const MIN_FONT_SIZE = 1;

/** Maximum allowed font size */
export const MAX_FONT_SIZE = 99;

/** Default font size used when no valid size is provided */
export const DEFAULT_FONT_SIZE = 16;

/** Custom event name for font size changes */
export const FONT_SIZE_CHANGE_EVENT = 'tiptap-font-size-changed';

/** Custom event name for font size parsed from DOM */
export const FONT_SIZE_PARSED_EVENT = 'tiptap-font-size-parsed';

/** Custom event name for clearing font cache */
export const CLEAR_FONT_CACHE_EVENT = 'tiptap-clear-font-cache';

/** Event sources for better debugging */
export const EVENT_SOURCES = {
  INPUT: 'input',
  DOM: 'dom',
  DOM_INIT: 'dom-init',
  DOM_COMPUTED: 'dom-computed',
  DOM_VERIFY: 'dom-verify',
  EDITOR_UPDATE: 'editor-update',
  DIRECT_DOM_CHECK: 'direct-dom-check',
  UNKNOWN: 'unknown'
};
