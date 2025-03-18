
# useDocumentTitle Hook

**Last Updated:** 2023-11-20

## Purpose

The `useDocumentTitle` hook manages document title state and synchronization with the document storage system. It provides functionality for displaying, editing, and saving document titles.

## Usage

```tsx
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

function DocumentHeader({ documentId }) {
  const {
    title,
    setTitle,
    isEditing,
    startEditing,
    stopEditing,
    saveTitle,
    isSaving,
    hasChanges
  } = useDocumentTitle(documentId);
  
  return (
    <div className="document-header">
      {isEditing ? (
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={stopEditing}
          autoFocus
        />
      ) : (
        <h1 onClick={startEditing}>
          {title || 'Untitled Document'}
        </h1>
      )}
      
      {hasChanges && (
        <button 
          onClick={saveTitle}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Title'}
        </button>
      )}
    </div>
  );
}
```

## Parameters

| Parameter | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| documentId | string | - | Yes | The ID of the document whose title to manage |
| initialTitle | string | '' | No | Initial title to use before loading |
| autoSave | boolean | true | No | Whether to automatically save title changes |

## Return Value

The hook returns an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| title | string | Current document title |
| setTitle | (title: string) => void | Function to update the title |
| isEditing | boolean | Whether the title is currently being edited |
| startEditing | () => void | Function to start editing the title |
| stopEditing | () => void | Function to stop editing the title |
| saveTitle | () => Promise<boolean> | Function to save the title |
| isSaving | boolean | Whether the title is currently being saved |
| hasChanges | boolean | Whether the title has unsaved changes |
| error | Error \| null | Any error that occurred during saving |

## Behavior

The `useDocumentTitle` hook:

1. **Loads the document title** when the component mounts
2. **Manages editing state** to toggle between view and edit modes
3. **Tracks unsaved changes** to indicate when saving is needed
4. **Provides save functionality** to persist title changes
5. **Handles errors** that may occur during loading or saving

### Loading

When the hook is first called with a document ID:

1. It sets a loading state
2. Fetches the document title from storage
3. Updates the title state with the fetched value
4. Clears the loading state

### Editing

The hook provides functions to manage the editing state:

- `startEditing()` - Sets `isEditing` to true
- `stopEditing()` - Sets `isEditing` to false and optionally saves if `autoSave` is true
- `setTitle(newTitle)` - Updates the title and sets `hasChanges` to true

### Saving

The hook provides a `saveTitle()` function that:

1. Sets `isSaving` to true
2. Calls the document service to update the title
3. Sets `hasChanges` to false if successful
4. Sets `isSaving` to false
5. Returns a boolean indicating success or failure

If `autoSave` is true, title changes are automatically saved when:
- The user stops editing (blur event)
- The component unmounts with unsaved changes

## Integration with Document System

The hook integrates with the document system:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│ useDocumentTitle│────▶│ Document Service│────▶│ Document Storage│
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. `useDocumentTitle` calls the document service to load and save titles
2. The document service handles the logic for interacting with storage
3. Changes are persisted to document storage

## Error Handling

The hook handles errors for loading and saving:

1. **Loading Errors** - If the document can't be loaded, the hook:
   - Sets an error state
   - Uses the initial title or a default value
   - Logs the error to the console

2. **Saving Errors** - If the title can't be saved, the hook:
   - Sets an error state
   - Keeps `hasChanges` as true
   - Returns false from the `saveTitle` function
   - Logs the error to the console

## Examples

### Basic Usage

```tsx
const DocumentTitle = ({ documentId }) => {
  const { title, setTitle, isEditing, startEditing, stopEditing } = useDocumentTitle(documentId);
  
  return isEditing ? (
    <input
      value={title}
      onChange={e => setTitle(e.target.value)}
      onBlur={stopEditing}
      autoFocus
    />
  ) : (
    <h1 onClick={startEditing}>{title || 'Untitled'}</h1>
  );
};
```

### Manual Save Mode

```tsx
const DocumentHeader = ({ documentId }) => {
  const {
    title,
    setTitle,
    isEditing,
    startEditing,
    stopEditing,
    saveTitle,
    hasChanges
  } = useDocumentTitle(documentId, '', false); // autoSave = false
  
  return (
    <div className="document-header">
      {isEditing ? (
        <>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <button onClick={stopEditing}>Cancel</button>
          <button onClick={saveTitle}>Save</button>
        </>
      ) : (
        <>
          <h1>{title || 'Untitled'}</h1>
          <button onClick={startEditing}>Edit Title</button>
          {hasChanges && <span>(Unsaved changes)</span>}
        </>
      )}
    </div>
  );
};
```

## Implementation Details

The hook is implemented using React's useState, useEffect, and useCallback hooks:

```tsx
function useDocumentTitle(documentId, initialTitle = '', autoSave = true) {
  const [title, setTitleState] = useState(initialTitle);
  const [originalTitle, setOriginalTitle] = useState(initialTitle);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Load the document title
  useEffect(() => {
    let isMounted = true;
    
    const loadTitle = async () => {
      try {
        const document = await documentService.getDocument(documentId);
        if (isMounted) {
          setTitleState(document.title);
          setOriginalTitle(document.title);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          console.error('Error loading document title:', err);
        }
      }
    };
    
    if (documentId) {
      loadTitle();
    }
    
    return () => {
      isMounted = false;
    };
  }, [documentId]);
  
  // Calculate if there are unsaved changes
  const hasChanges = title !== originalTitle;
  
  // Set the title
  const setTitle = useCallback((newTitle) => {
    setTitleState(newTitle);
  }, []);
  
  // Start editing
  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);
  
  // Stop editing
  const stopEditing = useCallback(() => {
    setIsEditing(false);
    
    if (autoSave && hasChanges) {
      saveTitle();
    }
  }, [autoSave, hasChanges]);
  
  // Save the title
  const saveTitle = useCallback(async () => {
    if (!hasChanges) return true;
    
    setIsSaving(true);
    setError(null);
    
    try {
      await documentService.updateDocumentTitle(documentId, title);
      setOriginalTitle(title);
      setIsSaving(false);
      return true;
    } catch (err) {
      setError(err);
      setIsSaving(false);
      console.error('Error saving document title:', err);
      return false;
    }
  }, [documentId, title, hasChanges]);
  
  // Clean up
  useEffect(() => {
    return () => {
      if (autoSave && hasChanges) {
        saveTitle();
      }
    };
  }, [autoSave, hasChanges, saveTitle]);
  
  return {
    title,
    setTitle,
    isEditing,
    startEditing,
    stopEditing,
    saveTitle,
    isSaving,
    hasChanges,
    error
  };
}
```

## Testing

To test this hook:

1. **Mock the document service** to return predictable responses
2. **Test initial loading** of the document title
3. **Test editing functionality** including setting and saving titles
4. **Test error handling** for both loading and saving
5. **Test auto-save behavior** when enabled

Example test:

```tsx
describe('useDocumentTitle', () => {
  it('loads document title on mount', async () => {
    // Mock document service
    jest.spyOn(documentService, 'getDocument').mockResolvedValue({
      id: 'doc123',
      title: 'Test Document'
    });
    
    // Render hook
    const { result, waitForNextUpdate } = renderHook(() => 
      useDocumentTitle('doc123')
    );
    
    // Initially should use empty string
    expect(result.current.title).toBe('');
    
    // Wait for data to load
    await waitForNextUpdate();
    
    // Should have updated with loaded title
    expect(result.current.title).toBe('Test Document');
  });
  
  it('saves title changes', async () => {
    // Mock document service
    jest.spyOn(documentService, 'getDocument').mockResolvedValue({
      id: 'doc123',
      title: 'Original Title'
    });
    
    jest.spyOn(documentService, 'updateDocumentTitle').mockResolvedValue(true);
    
    // Render hook
    const { result, waitForNextUpdate } = renderHook(() => 
      useDocumentTitle('doc123')
    );
    
    // Wait for data to load
    await waitForNextUpdate();
    
    // Update title
    act(() => {
      result.current.setTitle('New Title');
    });
    
    // Should have unsaved changes
    expect(result.current.hasChanges).toBe(true);
    
    // Save title
    act(() => {
      result.current.saveTitle();
    });
    
    // Wait for save to complete
    await waitForNextUpdate();
    
    // Should no longer have unsaved changes
    expect(result.current.hasChanges).toBe(false);
    
    // Document service should have been called correctly
    expect(documentService.updateDocumentTitle).toHaveBeenCalledWith(
      'doc123',
      'New Title'
    );
  });
});
```
