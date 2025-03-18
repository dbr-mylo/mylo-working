
# Component Integration

**Last Updated:** 2023-11-15

## Overview

This document explains how components integrate with each other in the application, focusing on communication patterns, data flow, and component responsibilities.

## Component Hierarchy

The application uses a nested component hierarchy:

```
App
├── AuthProvider
│   ├── RoleProvider
│   │   ├── MainLayout
│   │   │   ├── Navigation
│   │   │   ├── DocumentView / DesignerView
│   │   │   │   ├── EditorToolbar
│   │   │   │   ├── RichTextEditor
│   │   │   │   ├── StylePanel
│   │   │   │   └── TemplateControls
│   │   │   └── DocumentList
```

## Integration Patterns

Components integrate with each other using several patterns:

### 1. Props-Based Integration

The most direct form of component integration:

```tsx
// Parent component
const Parent = () => {
  const [value, setValue] = useState("");
  
  return <Child value={value} onChange={setValue} />;
};

// Child component
const Child = ({ value, onChange }) => {
  return <input value={value} onChange={e => onChange(e.target.value)} />;
};
```

**When to use**: For direct parent-child communication and when the state doesn't need to be shared widely.

### 2. Context-Based Integration

For sharing state across component trees:

```tsx
// Context provider
const ValueProvider = ({ children }) => {
  const [value, setValue] = useState("");
  
  return (
    <ValueContext.Provider value={{ value, setValue }}>
      {children}
    </ValueContext.Provider>
  );
};

// Consumer component
const Consumer = () => {
  const { value, setValue } = useContext(ValueContext);
  
  return <input value={value} onChange={e => setValue(e.target.value)} />;
};
```

**When to use**: When state needs to be accessed by many components at different levels of the tree.

### 3. Store-Based Integration

For global state management:

```tsx
// Component using a store
const DocumentEditor = () => {
  const { content, setContent } = useDocument(documentId);
  
  return <Editor content={content} onChange={setContent} />;
};
```

**When to use**: For application-wide state that needs to be persisted and shared across routes.

### 4. Event-Based Integration

For loosely-coupled component communication:

```tsx
// Event emitter
const FontSizeControl = () => {
  const handleChange = (size) => {
    editor.dispatchEvent(new CustomEvent("fontsizechange", {
      detail: { fontSize: size }
    }));
  };
  
  return <input onChange={e => handleChange(e.target.value)} />;
};

// Event listener
const FontSizeDisplay = () => {
  const [fontSize, setFontSize] = useState("16px");
  
  useEffect(() => {
    const handleFontSizeChange = (event) => {
      setFontSize(event.detail.fontSize);
    };
    
    editor.addEventListener("fontsizechange", handleFontSizeChange);
    return () => {
      editor.removeEventListener("fontsizechange", handleFontSizeChange);
    };
  }, [editor]);
  
  return <div>Current font size: {fontSize}</div>;
};
```

**When to use**: When components need to communicate without direct relationship, or for cross-cutting concerns.

## Component Integration Examples

### Editor Component Integration

The rich text editor integrates with multiple components:

1. **EditorToolbar** → **RichTextEditor**:
   - Toolbar buttons trigger editor commands
   - Editor state updates toolbar button states

2. **StyleSelector** → **RichTextEditor**:
   - Style selection is applied to editor content
   - Editor selection determines available styles

3. **TemplateControls** → **RichTextEditor**:
   - Template application affects editor content and styles
   - Template dimensions affect editor layout

```tsx
// Integration example
const EditorContainer = () => {
  const { editor, currentFont, currentColor, handleFontChange, handleColorChange } = useEditorSetup({
    content: documentContent,
    onContentChange: handleContentChange
  });
  
  return (
    <div>
      <EditorToolbar
        editor={editor}
        currentFont={currentFont}
        currentColor={currentColor}
        onFontChange={handleFontChange}
        onColorChange={handleColorChange}
      />
      <RichTextEditor editor={editor} />
    </div>
  );
};
```

## Role-Based Component Integration

Components adapt their integration based on user roles:

### Designer Role Integration

For designers, components integrate to provide design capabilities:

```tsx
const DesignerView = () => {
  // Designer-specific integration
  return (
    <>
      <DesignerToolbar />
      <div className="flex">
        <StyleEditor />
        <DocumentPreview />
        <TemplateControls />
      </div>
    </>
  );
};
```

### Editor Role Integration

For editors, components integrate to focus on content creation:

```tsx
const EditorView = () => {
  // Editor-specific integration
  return (
    <>
      <EditorToolbar />
      <div className="flex">
        <StyleSelector />
        <RichTextEditor />
      </div>
    </>
  );
};
```

## Best Practices

1. **Clear Responsibilities** - Each component should have clear responsibilities
2. **Minimal Props** - Pass only necessary props between components
3. **State Hoisting** - Lift state up to the appropriate level
4. **Custom Hooks** - Use custom hooks to share logic between components
5. **Memoization** - Optimize component rendering with React.memo and useMemo
