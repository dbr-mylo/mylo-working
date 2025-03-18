
# Rich Text Components

**Last Updated:** 2023-11-15

## Overview

The Rich Text components provide the core editing experience, including text formatting, styling, and content management. These components are built on the TipTap editor with custom extensions and enhancements.

## Key Components

- **EditorContainer**: The main wrapper for the rich text editor
- **EditorToolbar**: Provides formatting controls and style options
- **FontPicker**: Component for selecting and applying fonts
- **ColorPicker**: Component for selecting and applying text colors
- **FormatControls**: Buttons for common text formatting (bold, italic, lists)
- **StyleControls**: Dropdown and controls for applying text styles

## Key Systems

- [Font Size System](./FontSizeSystem.md): Components and hooks for managing font sizes
- [Color Preservation](./ColorPreservation.md): System to maintain text color during formatting

## Extensions

- **FontFamily**: Adds support for changing font families
- **FontSize**: Adds support for precise font size control
- **IndentExtension**: Provides indentation capabilities
- **CustomLists**: Enhanced list formatting

## Hooks

- **useEditorCore**: Initializes the TipTap editor with extensions
- **useFontAndColorState**: Manages font and color selection
- **useFontSizeTracking**: Tracks and updates font size in the editor
- **useEditorCleanup**: Handles cleanup and initialization

## Styles

- **BaseEditorStyles**: Core styles for the editor
- **FontSizeStyles**: Styles specific to font size handling
- **ColorPreservationStyles**: Styles for maintaining color during formatting
- **ListAndIndentStyles**: Styles for lists and indentation

## Usage

```tsx
// Basic editor setup
const { editor, currentFont, currentColor, handleFontChange, handleColorChange } = useEditorSetup({
  content: documentContent,
  onContentChange: handleContentChange
});

// Render the editor
return (
  <EditorContainer
    editor={editor}
    currentFont={currentFont}
    currentColor={currentColor}
    onFontChange={handleFontChange}
    onColorChange={handleColorChange}
  />
);
```

## Best Practices

1. **Extension Integration**: When adding new extensions, ensure they respect color preservation
2. **State Management**: Use the provided hooks for state management
3. **Event Handling**: Use the custom event system for cross-component communication
4. **Role Awareness**: Check user roles before rendering specialized controls
