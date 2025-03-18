
# useDocumentTitle

**Last Updated:** 2023-11-15

## Purpose

The `useDocumentTitle` hook manages the document title state and synchronization. It provides functionality for changing the document title and automatically syncing those changes with external systems when the title loses focus.

## Signature

```typescript
function useDocumentTitle({ 
  initialTitle, 
  onTitleChange 
}: UseDocumentTitleProps): {
  title: string;
  handleTitleChange: (newTitle: string) => void;
  handleTitleBlur: () => Promise<void>;
};
```

## Type Definitions

```typescript
interface UseDocumentTitleProps {
  initialTitle: string;
  onTitleChange?: (title: string) => Promise<void>;
}
```

## Parameters

| Parameter | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| initialTitle | string | - | Yes | The initial title value to display |
| onTitleChange | (title: string) => Promise<void> | undefined | No | Optional callback function that is called when the title is changed and the input loses focus |

## Return Value

The hook returns an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| title | string | The current title state value |
| handleTitleChange | (newTitle: string) => void | Function to update the title state |
| handleTitleBlur | () => Promise<void> | Function to call when the title input loses focus, which triggers the onTitleChange callback if the title has changed from initial value |

## Behavior

- On initialization, the hook sets the internal title state to match the provided initialTitle.
- When the initialTitle prop changes, the internal title state is updated to match.
- The handleTitleChange function updates the internal title state.
- The handleTitleBlur function is meant to be called when a title input field loses focus:
  - It will call the onTitleChange callback with the current title if:
    - The onTitleChange callback exists
    - The current title is different from the initialTitle
  - If either condition is not met, the onTitleChange callback will not be called.

## Examples

### Basic Usage

```tsx
import { useDocumentTitle } from '@/components/editor-nav/hooks/useDocumentTitle';

function DocumentTitleEditor() {
  const { 
    title, 
    handleTitleChange, 
    handleTitleBlur 
  } = useDocumentTitle({
    initialTitle: 'Untitled Document',
    onTitleChange: async (newTitle) => {
      // Save the new title to a database or other storage
      await api.saveDocumentTitle(documentId, newTitle);
      console.log('Title saved:', newTitle);
    }
  });
  
  return (
    <input
      value={title}
      onChange={(e) => handleTitleChange(e.target.value)}
      onBlur={handleTitleBlur}
      placeholder="Document Title"
    />
  );
}
```

### Without Title Change Callback

```tsx
function ReadOnlyDocumentTitle() {
  const { title } = useDocumentTitle({
    initialTitle: 'Readonly Document',
  });
  
  return <h1>{title}</h1>;
}
```

## Lifecycle

1. Hook initialization: Sets title state to initialTitle
2. User changes title: handleTitleChange updates internal state
3. Input loses focus: handleTitleBlur checks if title changed
4. If changed and callback exists: onTitleChange is called with new title
5. If initialTitle prop changes: title state is updated to match

## Edge Cases

- If onTitleChange is not provided, title changes will only be reflected in the component state but not persisted externally.
- If the title is changed but then changed back to the initialTitle before blur, onTitleChange will not be called.
- The hook does not validate the title format or perform any sanitation.
- If onTitleChange throws an error, it will not be caught by the hook.

## Performance Considerations

- The hook uses useState for state management, which causes re-renders when the title changes.
- The hook uses useEffect to synchronize with initialTitle changes, which may cause an additional render.
- The onTitleChange callback is only called when necessary (when the title actually changes), preventing unnecessary external updates.

## Related Hooks

- `useDocumentSave` - For saving the entire document content
- `useCloseDocument` - For handling document closing operations
