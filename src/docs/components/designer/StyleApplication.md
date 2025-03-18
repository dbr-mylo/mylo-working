# Style Application System

**Last Updated:** 2023-11-15

## Overview

The Style Application System enables designers and editors to apply predefined text styles to content. This system bridges the gap between style definitions and content formatting, ensuring consistent typography throughout documents.

## Core Components

### StyleApplicator

The main component for applying styles to selected text:

```tsx
<StyleApplicator
  onApplyStyle={handleApplyStyle}
  selectedElement={selectedElement}
/>
```

### StyleDropdown

A dropdown component for selecting and applying text styles:

```tsx
<StyleDropdown editor={editor} />
```

### StyleContextMenu

A context menu for applying styles to selected text:

```tsx
<StyleContextMenu
  editor={editor}
  isOpen={isContextMenuOpen}
  position={contextMenuPosition}
  onClose={closeContextMenu}
/>
```

## Style Application Workflow

The style application process follows these steps:

### 1. Style Selection

1. User selects text in the editor
2. User opens the style selector (toolbar, context menu, or sidebar)
3. Available styles are displayed, grouped by category
4. User selects a style to apply

### 2. Style Application

1. The selected style ID is passed to the application function
2. The style with all inherited properties is retrieved
3. Each style property is applied to the selected text
4. The editor is updated to reflect the changes

### 3. Style Visualization

1. Applied styles are reflected in the content
2. The current style is highlighted in the style selector
3. Style information is displayed in the UI when text is selected

## Application Methods

Styles can be applied through several UI methods:

### Toolbar Style Dropdown

```tsx
<StyleDropdown
  editor={editor}
  onSelectStyle={handleApplyStyle}
/>
```

### Context Menu

```tsx
<StyleContextMenu
  editor={editor}
  onSelectStyle={handleApplyStyle}
/>
```

### Sidebar Style Browser

```tsx
<StyleBrowser
  textStyles={textStyles}
  onSelectStyle={handleApplyStyle}
/>
```

### Keyboard Shortcuts

```typescript
// Register keyboard shortcuts for commonly used styles
editor.registerKeyboardShortcut(
  'Ctrl-Alt-1',
  () => applyStyle('heading-1')
);
```

## Implementation Details

### Style Application Function

The core function for applying a style:

```typescript
const applyStyle = (styleId: string) => {
  // Get the style with inheritance resolved
  const style = textStyleStore.getStyleWithInheritance(styleId);
  
  // Begin a chain of commands to update the editor
  editor.chain().focus();
  
  // Apply each property of the style
  if (style.fontFamily) {
    editor.chain().setFontFamily(style.fontFamily);
  }
  
  if (style.fontSize) {
    editor.chain().setFontSize(style.fontSize);
  }
  
  if (style.color) {
    editor.chain().setColor(style.color);
  }
  
  if (style.fontWeight) {
    editor.chain().setFontWeight(style.fontWeight);
  }
  
  // Apply additional properties as needed
  
  // Execute the chain of commands
  editor.chain().run();
};
```

### Style Detection

The system also detects applied styles when text is selected:

```typescript
const detectAppliedStyle = () => {
  const selection = editor.state.selection;
  if (selection.empty) {
    return null;
  }
  
  // Get current text properties
  const props = {
    fontFamily: editor.getAttributes('textStyle').fontFamily,
    fontSize: editor.getAttributes('textStyle').fontSize,
    fontWeight: editor.getAttributes('textStyle').fontWeight,
    color: editor.getAttributes('textStyle').color,
    // Additional properties...
  };
  
  // Find matching style
  return textStyles.find(style => {
    // Check if all style properties match the current selection
    return style.fontFamily === props.fontFamily &&
           style.fontSize === props.fontSize &&
           style.fontWeight === props.fontWeight &&
           style.color === props.color;
  });
};
```

## Style Application Hooks

### useStyleApplication

A hook for managing style application:

```typescript
const { applyStyle, currentStyleId, currentStyle } = useStyleApplication(editor);
```

### useStyleDetection

A hook for detecting applied styles:

```typescript
const { detectedStyleId, detectedStyle } = useStyleDetection(editor);
```

## Role-Based Behavior

The style application system adapts based on user roles:

### Designer Role

Designers have full capabilities:
- Apply any style to content
- Create new styles from selections
- Modify existing styles

### Editor Role

Editors have restricted capabilities:
- Apply existing styles to content
- Cannot create or modify styles
- Can view style information

## Integration with Text Formatting

Style application integrates with the text formatting system:

1. When a style is applied, individual formatting attributes are set
2. Subsequent manual formatting (bold, italic, etc.) is applied on top of the style
3. The color preservation system ensures that style colors are maintained

## Usage Example

```tsx
const EditorWithStyleApplication = () => {
  const { editor } = useEditor();
  const { applyStyle, currentStyleId } = useStyleApplication(editor);
  
  const handleStyleSelect = (styleId: string) => {
    applyStyle(styleId);
  };
  
  return (
    <div>
      <EditorToolbar>
        <StyleDropdown
          editor={editor}
          currentStyleId={currentStyleId}
          onSelectStyle={handleStyleSelect}
        />
        {/* Other toolbar controls */}
      </EditorToolbar>
      
      <EditorContent editor={editor} />
      
      <StyleContextMenu
        editor={editor}
        onSelectStyle={handleStyleSelect}
      />
    </div>
  );
};
```

## Best Practices

1. **Preview before applying** - Provide style previews before application
2. **Group related styles** - Organize styles into logical groups
3. **Clear indicators** - Clearly indicate which style is currently applied
4. **Keyboard shortcuts** - Provide shortcuts for commonly used styles
5. **Consistent UI** - Use consistent UI patterns for style application
