
# Font Size System

**Last Updated:** 2023-11-15

## Overview

The Font Size System provides precise control over text sizing in the editor. It includes UI components, state management hooks, and extension integration to ensure consistent font size application and display.

## Components

### FontSizeInput
A numeric input field with increment/decrement buttons for precise font size control.

### FontSizeDropdown
A dropdown menu with preset font size options for quick selection.

### CombinedFontSizeControl
Combines the input and dropdown components for comprehensive font size control.

### FontSizeSection
Container component that integrates font size controls into the editor toolbar.

## Hooks

### useFontSizeState
Manages the state for font size input components:
- Tracks the current size value
- Provides handlers for size changes
- Enforces minimum and maximum limits

### useFontSizeTracking
Tracks the font size of selected text in the editor:
- Detects font size from selection
- Updates UI when selection changes
- Provides handlers for applying font size changes

### useFontSizeEventHandling
Manages communication between font size components:
- Listens for font size change events
- Updates components when font size changes
- Coordinates between different font size inputs

## Extension

The FontSize extension for TipTap adds font size capabilities to the editor:
- Adds commands for setting and unsetting font size
- Manages font size attributes in the document
- Renders appropriate HTML with font size styles

## Constants

```typescript
// Minimum and maximum allowed font sizes
export const MIN_FONT_SIZE = 1;
export const MAX_FONT_SIZE = 99;

// Default font size
export const DEFAULT_FONT_SIZE = 16;

// Event names for communication
export const FONT_SIZE_CHANGE_EVENT = 'tiptap-font-size-changed';
export const FONT_SIZE_PARSED_EVENT = 'tiptap-font-size-parsed';
export const CLEAR_FONT_CACHE_EVENT = 'tiptap-clear-font-cache';

// Preset font sizes for the dropdown
export const TEXT_PRESETS = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
```

## Utility Functions

### parseFontSize
Extracts a numeric value from a font size string.

### formatFontSize
Formats a numeric value to a font size string with "px" units.

### clampFontSize
Restricts a font size value to the allowed range.

### validateFontSize
Validates a font size and returns information about its validity.

## CSS Integration

The FontSizeStyles component provides CSS rules to ensure consistent font size rendering:
- Overrides Tailwind prose defaults
- Ensures font sizes are applied correctly
- Provides a mechanism to refresh font display

## Usage

```tsx
// Using the font size input
const { size, handleInputChange, incrementSize, decrementSize } = useFontSizeState({
  value: "16px",
  onChange: (newSize) => editor.commands.setFontSize(newSize)
});

<FontSizeInput
  value={size}
  onChange={handleInputChange}
  onIncrement={incrementSize}
  onDecrement={decrementSize}
/>

// Setting font size in the editor
editor.commands.setFontSize("18px");
```

## Best Practices

1. **Input Validation**: Always validate font sizes to ensure they're within allowed ranges
2. **Event Usage**: Use the event system for coordination between components
3. **Performance**: Debounce font size changes to prevent excessive updates
4. **Accessibility**: Ensure font size controls are keyboard accessible
