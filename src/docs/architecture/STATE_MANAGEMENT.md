
# State Management Architecture

**Last Updated:** 2023-11-15

## Overview

This document outlines the state management architecture of the application, including the types of state, store implementations, and data flow patterns.

## Types of State

The application manages several types of state:

### 1. UI State

Ephemeral state that controls the user interface:
- Modal visibility
- Form input values
- Dropdown open/closed state
- Selected tabs
- Hover states

### 2. Session State

State that persists during a user session:
- Current document
- Text selection
- Toolbar settings
- View preferences

### 3. Entity State

The core data entities of the application:
- Documents
- Templates
- Text styles
- User preferences

### 4. Application State

Global application-level state:
- Authentication status
- User role
- Feature flags
- System settings

## State Management Patterns

The application employs several state management patterns:

### 1. Local Component State

For UI state isolated to a single component:

```tsx
const ButtonGroup = () => {
  const [selectedButton, setSelectedButton] = useState("bold");
  
  return (
    <div>
      <button 
        className={selectedButton === "bold" ? "active" : ""}
        onClick={() => setSelectedButton("bold")}
      >
        Bold
      </button>
      <button 
        className={selectedButton === "italic" ? "active" : ""}
        onClick={() => setSelectedButton("italic")}
      >
        Italic
      </button>
    </div>
  );
};
```

### 2. Custom Hooks

For encapsulating state logic and sharing it across components:

```tsx
// Custom hook
const useDocumentTitle = ({ initialTitle, onTitleChange }) => {
  const [title, setTitle] = useState(initialTitle);
  
  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
  };
  
  const handleTitleBlur = () => {
    if (title !== initialTitle) {
      onTitleChange(title);
    }
  };
  
  return { title, handleTitleChange, handleTitleBlur };
};

// Usage in component
const DocumentHeader = ({ document, onUpdate }) => {
  const { title, handleTitleChange, handleTitleBlur } = useDocumentTitle({
    initialTitle: document.title,
    onTitleChange: (newTitle) => onUpdate({ ...document, title: newTitle })
  });
  
  return (
    <input
      value={title}
      onChange={(e) => handleTitleChange(e.target.value)}
      onBlur={handleTitleBlur}
    />
  );
};
```

### 3. React Context

For state that needs to be accessed by many components at different levels:

```tsx
// Context provider
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  
  // Authentication logic...
  
  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Context consumer
const UserMenu = () => {
  const { user, logout } = useContext(AuthContext);
  
  return (
    <div>
      <span>Welcome, {user.name}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### 4. Store Pattern

For global state that needs to be persisted and shared across routes:

```tsx
// Store module
export const textStyleStore = {
  getTextStyles,
  getLocalTextStyles,
  saveTextStyle,
  saveLocalTextStyle,
  deleteTextStyle,
  duplicateTextStyle,
  // ...additional methods
};

// Store usage with a custom hook
export const useTextStyles = () => {
  const [styles, setStyles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadStyles = async () => {
      setIsLoading(true);
      try {
        const loadedStyles = await textStyleStore.getTextStyles();
        setStyles(loadedStyles);
      } catch (error) {
        console.error("Error loading styles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStyles();
  }, []);
  
  const createStyle = async (style) => {
    const newStyle = await textStyleStore.saveTextStyle(style);
    setStyles([...styles, newStyle]);
    return newStyle;
  };
  
  // Additional methods...
  
  return {
    styles,
    isLoading,
    createStyle,
    // ...more methods
  };
};
```

## Store Implementations

The application uses custom store modules for global state:

### textStyleStore

Manages text styles for the application:

```typescript
// Store definition
export const textStyleStore = {
  // Query methods
  getTextStyles,
  getLocalTextStyles,
  getDefaultStyle,
  getStylesWithParent,
  getStyleWithInheritance,
  getInheritanceChain,
  
  // Mutation methods
  saveTextStyle,
  saveLocalTextStyle,
  deleteTextStyle,
  duplicateTextStyle,
  setDefaultStyle,
  
  // Utility methods
  generateCSSFromTextStyles,
  clearCachedStylesByPattern,
  clearDefaultResetStyle,
  clearEditorCache,
  resetTextStylesToDefaults,
  deepCleanStorage
};
```

### templateStore

Manages document templates:

```typescript
// Store usage example
const { templates, isLoading, createTemplate, updateTemplate } = useTemplates();
```

## Data Flow Patterns

### Unidirectional Data Flow

The application follows a unidirectional data flow pattern:

1. User interaction triggers an action
2. Action updates the store
3. Store notifies components of state changes
4. Components re-render with new state

```
┌──────────────┐     ┌───────────────┐     ┌────────────────┐
│              │     │               │     │                │
│  User Action │────▶│ Store Actions │────▶│ State Updates  │
│              │     │               │     │                │
└──────────────┘     └───────────────┘     └────────────────┘
                                                    │
                                                    ▼
┌──────────────┐     ┌───────────────┐     ┌────────────────┐
│              │     │               │     │                │
│   UI Update  │◀────│   Component   │◀────│  Subscription  │
│              │     │   Re-render   │     │                │
└──────────────┘     └───────────────┘     └────────────────┘
```

### Event-Based Data Flow

For loosely-coupled components:

1. Component A dispatches an event
2. Event system broadcasts the event
3. Component B receives the event and updates its state
4. Component B re-renders with new state

```
┌──────────────┐     ┌───────────────┐     ┌────────────────┐
│              │     │               │     │                │
│ Component A  │────▶│  Event System │────▶│  Component B   │
│              │     │               │     │                │
└──────────────┘     └───────────────┘     └────────────────┘
                                                    │
                                                    ▼
                                            ┌────────────────┐
                                            │                │
                                            │  State Update  │
                                            │                │
                                            └────────────────┘
                                                    │
                                                    ▼
                                            ┌────────────────┐
                                            │                │
                                            │   UI Update    │
                                            │                │
                                            └────────────────┘
```

## Role-Based State Management

The application adapts its state management based on user roles:

### Designer Role

Designers have access to additional state:
- Template creation state
- Style management state
- Design settings

### Editor Role

Editors have access to restricted state:
- Content editing state
- Style application state (but not creation)
- Document saving state

## State Persistence

The application persists state in several ways:

### 1. Browser Storage

For user preferences and session state:

```typescript
// Save to localStorage
const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Load from localStorage
const loadFromLocalStorage = (key, defaultValue) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};
```

### 2. Remote Storage

For entity state and application state:

```typescript
// Save to remote database
const saveDocument = async (document) => {
  const { data, error } = await supabase
    .from('documents')
    .upsert(document);
    
  if (error) throw error;
  return data;
};

// Load from remote database
const loadDocument = async (id) => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data;
};
```

## Best Practices

1. **State Locality** - Keep state as local as possible
2. **State Normalization** - Avoid duplicate state
3. **Minimize Rerenders** - Optimize component updates with memoization
4. **State Documentation** - Document the purpose and structure of each state
5. **Consistent Patterns** - Use consistent patterns for similar state needs
6. **Error Handling** - Handle errors gracefully in state updates
7. **Loading States** - Provide clear loading indicators for asynchronous state
