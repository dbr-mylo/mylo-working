
# Event System Documentation

**Last Updated:** 2023-11-15

## Overview

The application's event system provides a way for loosely-coupled components to communicate with each other. This document explains the event system architecture, event types, and best practices for working with events.

## Event Architecture

The event system uses a combination of:

1. **Browser CustomEvents** - For component-to-component communication
2. **React State Updates** - For triggering re-renders based on events
3. **Event Hooks** - Custom hooks that manage event listening and dispatching

## Event Types

### Editor Events

Events related to the rich text editor:

| Event Name | Payload | Description |
|------------|---------|-------------|
| `fontsizechange` | `{ fontSize: string }` | Fired when font size changes |
| `fontfamilychange` | `{ fontFamily: string }` | Fired when font family changes |
| `colorchange` | `{ color: string }` | Fired when text color changes |
| `styleapply` | `{ styleId: string }` | Fired when a text style is applied |
| `contentchange` | `{ content: string }` | Fired when editor content changes |
| `selectionchange` | `{ selection: object }` | Fired when the text selection changes |

### Document Events

Events related to document management:

| Event Name | Payload | Description |
|------------|---------|-------------|
| `documentsave` | `{ id: string, content: string }` | Fired when a document is saved |
| `documentload` | `{ id: string, content: string }` | Fired when a document is loaded |
| `documentdelete` | `{ id: string }` | Fired when a document is deleted |
| `documenttitlechange` | `{ id: string, title: string }` | Fired when a document title changes |

### Style Events

Events related to text styles:

| Event Name | Payload | Description |
|------------|---------|-------------|
| `stylecreate` | `{ style: StyleObject }` | Fired when a style is created |
| `styleupdate` | `{ style: StyleObject }` | Fired when a style is updated |
| `styledelete` | `{ id: string }` | Fired when a style is deleted |
| `stylereset` | None | Fired when styles are reset to defaults |

## Using the Event System

### Dispatching Events

To dispatch an event:

```typescript
// Within a component or hook
const dispatchFontSizeChange = (fontSize: string) => {
  editor.dispatchEvent(new CustomEvent("fontsizechange", {
    detail: { fontSize }
  }));
};

// Usage
dispatchFontSizeChange("16px");
```

### Listening for Events

To listen for an event:

```typescript
// Within a React component
useEffect(() => {
  const handleFontSizeChange = (event: CustomEvent) => {
    const { fontSize } = event.detail;
    setCurrentFontSize(fontSize);
  };
  
  editor.addEventListener("fontsizechange", handleFontSizeChange);
  
  return () => {
    editor.removeEventListener("fontsizechange", handleFontSizeChange);
  };
}, [editor]);
```

### Using Event Hooks

The application provides custom hooks for common events:

```typescript
// Using a custom hook for font size events
const { currentFontSize, setFontSize } = useFontSizeEvents(editor);

// The hook internally manages event listening and dispatching
const useFontSizeEvents = (editor) => {
  const [currentFontSize, setCurrentFontSize] = useState("16px");
  
  useEffect(() => {
    if (!editor) return;
    
    const handleFontSizeChange = (event) => {
      setCurrentFontSize(event.detail.fontSize);
    };
    
    editor.addEventListener("fontsizechange", handleFontSizeChange);
    
    return () => {
      editor.removeEventListener("fontsizechange", handleFontSizeChange);
    };
  }, [editor]);
  
  const setFontSize = (fontSize) => {
    editor.dispatchEvent(new CustomEvent("fontsizechange", {
      detail: { fontSize }
    }));
  };
  
  return { currentFontSize, setFontSize };
};
```

## Event Flow Examples

### Font Size Change Flow

1. User changes font size in the EditorToolbar
2. EditorToolbar dispatches a `fontsizechange` event
3. RichTextEditor listens for the event and updates the editor
4. FontSizeDisplay listens for the event and updates its display
5. Editor state is updated

```
┌─────────────────┐         ┌──────────────────┐         ┌────────────────┐
│                 │         │                  │         │                │
│ EditorToolbar   │─Event──►│  RichTextEditor  │─State──►│ FontSizeDisplay│
│                 │         │                  │         │                │
└─────────────────┘         └──────────────────┘         └────────────────┘
```

### Style Application Flow

1. User selects a style in the StyleSelector
2. StyleSelector dispatches a `styleapply` event
3. StyleApplicator listens for the event and applies the style to the editor
4. EditorToolbar updates to reflect the applied style

```
┌─────────────────┐         ┌──────────────────┐         ┌────────────────┐
│                 │         │                  │         │                │
│  StyleSelector  │─Event──►│  StyleApplicator │─Event──►│  EditorToolbar │
│                 │         │                  │         │                │
└─────────────────┘         └──────────────────┘         └────────────────┘
                                      │
                                      ▼
                             ┌────────────────┐
                             │                │
                             │ RichTextEditor │
                             │                │
                             └────────────────┘
```

## Best Practices

1. **Event Naming** - Use consistent naming conventions for events
2. **Event Payload** - Keep event payloads small and relevant
3. **Event Documentation** - Document all events, their payloads, and purposes
4. **Cleanup Listeners** - Always remove event listeners in useEffect cleanup
5. **Custom Hooks** - Create custom hooks for common event patterns
6. **Event Debugging** - Use browser developer tools to debug event flow

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Event not firing | Check that the event name and target element are correct |
| Event listener not triggered | Verify the component is mounted when the event fires |
| Multiple events firing | Check for duplicate event listeners |
| Performance issues | Limit event frequency with debouncing or throttling |
