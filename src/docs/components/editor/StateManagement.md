
# Editor State Management

**Last Updated:** 2023-11-15

## Overview

The editor's state management system coordinates the complex state required for a rich text editing experience. This system handles everything from document content to selection states, formatting options, and user preferences.

## Key State Categories

### 1. Document Content State

Manages the core content of the document:

- **Content HTML** - The main document content in HTML format
- **Initial Content** - The original document content for comparison (detecting changes)
- **Document Metadata** - Title, creation date, last modified date, etc.

### 2. Editor State

Manages the state of the TipTap editor:

- **Selection** - Currently selected text or cursor position
- **Active Formatting** - Currently active formatting options (bold, italic, etc.)
- **History** - Undo/redo stack

### 3. UI State

Manages the state of the editor UI:

- **Current Font** - Selected font family
- **Current Color** - Selected text color
- **Current Font Size** - Selected font size
- **Toolbar Visibility** - Whether toolbars are visible
- **Sidebar Visibility** - Whether sidebars are visible

### 4. Style State

Manages text styles:

- **Available Styles** - List of available text styles
- **Selected Style** - Currently selected text style
- **Style Preview** - Preview of style application

## State Management Hooks

### useEditorSetup

Central hook for initializing the editor and managing core state:

```typescript
const { 
  editor,
  currentFont,
  currentColor,
  handleFontChange,
  handleColorChange
} = useEditorSetup({
  content: documentContent,
  onContentChange: handleContentChange
});
```

### useFontAndColorState

Manages the current font and color selection:

```typescript
const {
  currentFont,
  currentColor,
  handleFontChange,
  handleColorChange
} = useFontAndColorState(editor);
```

### useFontSizeTracking

Manages font size state for the editor:

```typescript
const {
  currentFontSize,
  setCurrentFontSize,
  handleFontSizeChange
} = useFontSizeTracking(editor);
```

### useDocumentTitle

Manages the document title with change tracking:

```typescript
const {
  title,
  handleTitleChange,
  handleTitleBlur
} = useDocumentTitle({
  initialTitle: document.title,
  onTitleChange: saveDocumentTitle
});
```

### useDocumentSave

Manages document saving state and operations:

```typescript
const {
  isSaving,
  handleSave
} = useDocumentSave({
  onSave: saveDocument,
  loadDocuments: refreshDocumentList,
  content: documentContent,
  documentType: "template"
});
```

### useCloseDocument

Manages the document closing workflow, including unsaved changes detection:

```typescript
const {
  showCloseDialog,
  setShowCloseDialog,
  handleCloseDocument,
  handleCloseWithoutSaving,
  handleSaveAndClose
} = useCloseDocument({
  content: documentContent,
  initialContent: initialDocumentContent,
  title: document.title,
  documentTitle: documentTitle,
  onSave: saveDocument
});
```

## State Synchronization

The editor implements several mechanisms to keep state synchronized:

### Event-Based Synchronization

The editor uses custom events to synchronize state between components:

```typescript
// Emit font size change event
editor.dispatchEvent(new CustomEvent("fontsizechange", {
  detail: { fontSize: "16px" }
}));

// Listen for font size change events
editor.addEventListener("fontsizechange", (event) => {
  setCurrentFontSize(event.detail.fontSize);
});
```

### Selection-Based Updates

State is updated based on the current selection:

```typescript
editor.on("selectionUpdate", () => {
  // Update the current font family based on selection
  const fontFamily = editor.getAttributes("textStyle").fontFamily;
  if (fontFamily) {
    setCurrentFont(fontFamily);
  }
  
  // Update the current color based on selection
  const color = editor.getAttributes("textStyle").color;
  if (color) {
    setCurrentColor(color);
  }
});
```

### Two-Way Binding

Some state implements two-way binding between the UI and the editor:

```typescript
// UI to editor
const handleFontChange = (font: string) => {
  setCurrentFont(font);
  editor.chain().focus().setFontFamily(font).run();
};

// Editor to UI
editor.on("update", () => {
  const fontFamily = editor.getAttributes("textStyle").fontFamily;
  if (fontFamily && fontFamily !== currentFont) {
    setCurrentFont(fontFamily);
  }
});
```

## Role-Based State Management

State management adapts based on the user's role:

### Designer Role

Designers have access to additional state:

- Template dimensions
- Style management
- Element selection

### Editor Role

Editors have access to restricted state:

- Content editing
- Style application (but not creation)
- Document saving

## State Persistence

The editor implements several approaches to state persistence:

### Local Storage

Some state is persisted to local storage:

```typescript
// Save the current font to local storage
localStorage.setItem("editor-current-font", currentFont);

// Load the current font from local storage
const savedFont = localStorage.getItem("editor-current-font");
if (savedFont) {
  setCurrentFont(savedFont);
}
```

### Remote Storage

Document content and metadata are persisted to remote storage:

```typescript
// Save document to remote storage
const saveDocument = async () => {
  await api.saveDocument({
    id: documentId,
    title: documentTitle,
    content: documentContent
  });
};
```

## Best Practices

1. **Minimize state** - Keep state as localized as possible
2. **Use hooks for related state** - Group related state in custom hooks
3. **Implement two-way binding carefully** - Avoid infinite update loops
4. **Consider performance** - Use debouncing for frequent state changes
5. **Handle edge cases** - Account for null/undefined states and loading states

