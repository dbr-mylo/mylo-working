
# Extending the Application

**Last Updated:** 2023-11-20

## Overview

This document provides guidelines for extending the application with new features and functionality while maintaining compatibility with existing code.

## Extension Principles

1. **Maintain Separation of Concerns** - Keep logic, UI, and state separate
2. **Follow Role-Based Architecture** - Respect designer and editor role separation
3. **Ensure Backward Compatibility** - Don't break existing features
4. **Document Extensions** - Thoroughly document new functionality

## Adding New Components

### Component Organization

Create new components in the appropriate directory:

- **UI Components** - `src/components/ui/`
- **Editor Components** - `src/components/editor/`
- **Designer Components** - `src/components/designer/`
- **Shared Components** - `src/components/common/`

### Component Structure

Each component should have:

1. **Props Interface** - Clear typing for all props
2. **Default Props** - Sensible defaults for optional props
3. **Internal State** - State management, preferably with hooks
4. **Documentation** - JSDoc comments for the component and props

Example component structure:

```tsx
/**
 * StyleBrowser Component
 * 
 * Displays a list of available text styles with filtering and selection.
 */
interface StyleBrowserProps {
  /** Styles to display */
  styles: TextStyle[];
  /** Currently selected style ID */
  selectedStyleId?: string;
  /** Called when a style is selected */
  onStyleSelect: (styleId: string) => void;
  /** Optional filter for styles */
  filter?: (style: TextStyle) => boolean;
}

export const StyleBrowser = ({
  styles,
  selectedStyleId,
  onStyleSelect,
  filter = () => true
}: StyleBrowserProps) => {
  const [searchText, setSearchText] = useState('');
  
  const filteredStyles = useMemo(() => {
    return styles
      .filter(filter)
      .filter(style => style.name.toLowerCase().includes(searchText.toLowerCase()));
  }, [styles, filter, searchText]);
  
  return (
    <div className="style-browser">
      {/* Component implementation */}
    </div>
  );
};
```

## Adding New Hooks

### Hook Organization

Create new hooks in the appropriate directory:

- **UI Hooks** - `src/hooks/ui/`
- **Feature Hooks** - `src/hooks/features/`
- **Data Hooks** - `src/hooks/data/`
- **Utility Hooks** - `src/hooks/utils/`

### Hook Structure

Each hook should have:

1. **Parameter Interface** - Clear typing for all parameters
2. **Return Type** - Explicit typing for returned values
3. **Documentation** - JSDoc comments explaining usage and behavior
4. **Error Handling** - Appropriate error handling and fallbacks

Example hook structure:

```tsx
/**
 * useStyleApplication Hook
 * 
 * Provides functions for applying text styles to editor content.
 * 
 * @param editor - The editor instance
 * @returns Functions for applying and removing styles
 */
export function useStyleApplication(editor: Editor | null) {
  /**
   * Applies a style to the selected text
   * 
   * @param styleId - The ID of the style to apply
   * @returns true if successful, false otherwise
   */
  const applyStyle = useCallback((styleId: string): boolean => {
    if (!editor || !editor.isEditable) {
      return false;
    }
    
    try {
      // Apply style implementation
      return true;
    } catch (error) {
      console.error('Error applying style:', error);
      return false;
    }
  }, [editor]);
  
  /**
   * Removes styles from the selected text
   * 
   * @returns true if successful, false otherwise
   */
  const removeStyles = useCallback((): boolean => {
    if (!editor || !editor.isEditable) {
      return false;
    }
    
    try {
      // Remove style implementation
      return true;
    } catch (error) {
      console.error('Error removing styles:', error);
      return false;
    }
  }, [editor]);
  
  return {
    applyStyle,
    removeStyles
  };
}
```

## Extending State Management

### Store Organization

Create new stores in the appropriate directory:

- **Feature Stores** - `src/stores/features/`
- **Entity Stores** - `src/stores/entities/`
- **UI Stores** - `src/stores/ui/`

### Store Structure

Each store should have:

1. **State Interface** - Clear typing for the store state
2. **Actions** - Functions that modify the state
3. **Selectors** - Functions that retrieve state values
4. **Documentation** - JSDoc comments explaining usage

Example store extension:

```tsx
// State interface
interface StyleHistoryState {
  history: StyleHistoryEntry[];
  maxEntries: number;
}

// Action to add a history entry
const addHistoryEntry = (
  state: StyleHistoryState,
  entry: StyleHistoryEntry
): StyleHistoryState => {
  const newHistory = [entry, ...state.history].slice(0, state.maxEntries);
  
  return {
    ...state,
    history: newHistory
  };
};

// Selector to get recent entries
const getRecentEntries = (
  state: StyleHistoryState,
  count: number = 5
): StyleHistoryEntry[] => {
  return state.history.slice(0, count);
};

// Export the extended store
export const styleHistoryStore = {
  initialState: { history: [], maxEntries: 20 },
  actions: {
    addHistoryEntry
  },
  selectors: {
    getRecentEntries
  }
};
```

## Adding New Services

### Service Organization

Create new services in the appropriate directory:

- **API Services** - `src/services/api/`
- **Storage Services** - `src/services/storage/`
- **Utility Services** - `src/services/utils/`

### Service Structure

Each service should have:

1. **Interface** - Clear typing for the service API
2. **Implementation** - The service implementation
3. **Documentation** - JSDoc comments explaining usage
4. **Error Handling** - Appropriate error handling

Example service:

```tsx
/**
 * Style Export Service
 * 
 * Provides functionality for exporting and importing text styles.
 */
export interface StyleExportService {
  /**
   * Exports styles to a JSON string
   * 
   * @param styleIds - Optional IDs of styles to export, exports all if omitted
   * @returns JSON string of exported styles
   */
  exportStylesToJSON(styleIds?: string[]): string;
  
  /**
   * Imports styles from a JSON string
   * 
   * @param json - JSON string of styles to import
   * @returns Array of imported style IDs
   */
  importStylesFromJSON(json: string): Promise<string[]>;
}

// Service implementation
export const styleExportService: StyleExportService = {
  exportStylesToJSON(styleIds) {
    // Implementation
  },
  
  async importStylesFromJSON(json) {
    // Implementation
  }
};
```

## Role-Based Extensions

When adding features for specific user roles:

### Designer-Only Features

1. Use the `DesignerOnly` component to wrap designer-specific UI
2. Use the `useDesignerRole` hook to check for designer permissions
3. Place designer components in the `src/components/designer/` directory

Example designer-only extension:

```tsx
import { DesignerOnly } from '@/utils/roles';

const StyleManager = () => {
  return (
    <div className="style-manager">
      <h2>Style Manager</h2>
      
      {/* Common UI visible to all roles */}
      <StyleBrowser />
      
      {/* Designer-only UI */}
      <DesignerOnly>
        <div className="designer-controls">
          <button>Create New Style</button>
          <button>Edit Styles</button>
        </div>
      </DesignerOnly>
    </div>
  );
};
```

### Editor-Only Features

1. Use the `EditorOnly` component to wrap editor-specific UI
2. Use the `useEditorRole` hook to check for editor permissions
3. Place editor components in the `src/components/editor/` directory

## Documentation Requirements

When extending the application, create the following documentation:

1. **Component Documentation** - Document new components using the component template
2. **Hook Documentation** - Document new hooks using the hook template
3. **Feature Documentation** - Document new features and how they integrate
4. **API Documentation** - Document any new APIs or services
5. **User Documentation** - Update user guides and workflows

## Testing Requirements

When extending the application, create the following tests:

1. **Unit Tests** - Test new components, hooks, and functions
2. **Integration Tests** - Test integration with existing features
3. **Role-Based Tests** - Test behavior with different user roles
4. **Updated User Flow Tests** - Update tests for any affected user flows
