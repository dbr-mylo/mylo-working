
# Editor Component Architecture

**Last Updated:** 2023-11-15

## Overview

The Editor component architecture provides a rich text editing experience with specialized behaviors for different user roles. The system is built on TipTap, with custom extensions and hooks to support advanced formatting, style application, and role-specific features.

## Component Hierarchy

```
EditorContainer
├── EditorInitializer
│   ├── EditorCacheManager
│   └── EditorToolbarWrapper
│       └── EditorToolbar
│           ├── FontPicker
│           ├── ColorPicker
│           ├── FormatControls
│           ├── ClearFormattingControl
│           └── StyleControls
└── RichTextEditor (TipTap instance)
```

## Core Components

### EditorContainer
The main wrapper component that initializes the editor and manages content state.

### EditorInitializer
Handles the initialization of the editor, including extensions, content loading, and event binding.

### EditorToolbar
Provides formatting controls and style options based on the user's role.

### RichTextEditor
The core editor component that renders the editable content area.

## State Management

The editor uses several custom hooks to manage state:

### useEditorSetup
Centralizes editor initialization and state management:
- Initializes the TipTap editor with custom extensions
- Manages font and color state
- Handles font size synchronization
- Provides template dimension information

### useFontAndColorState
Manages the current font and color selection:
- Tracks the currently selected font family
- Tracks the currently selected text color
- Provides handlers for changing font and color

### useFontSizeTracking
Manages font size state for the editor:
- Tracks the current font size of selected text
- Provides handlers for changing font size
- Synchronizes font size between the toolbar and editor

## Role-Based Behavior

The editor adapts its behavior and available features based on the user's role:

### Designer
- Access to advanced formatting controls
- Ability to create and manage text styles
- Template design capabilities
- Font size controls

### Editor
- Basic formatting controls
- Ability to apply existing styles
- Content editing within template constraints

## Extensions

Custom TipTap extensions enhance the editor's capabilities:

### FontFamily
Adds support for changing font families.

### FontSize
Adds support for precise font size control.

### IndentExtension
Provides indentation capabilities for paragraphs.

### CustomLists
Enhanced list formatting with better styling control.

## Events and Synchronization

The editor uses a custom event system to synchronize state:
- Font size changes trigger events to update the UI
- Selection changes update available formatting options
- Content changes trigger save events

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

1. **State Updates**: Use the provided handlers for state updates to ensure synchronization
2. **Extension Integration**: When adding new extensions, ensure they respect color preservation
3. **Role Awareness**: Always check the user's role before rendering specialized controls
4. **Performance**: Use debounced updates for frequent changes like font size adjustments
