# API and Hook Documentation

**Last Updated:** 2023-11-20

## Overview

This document provides comprehensive documentation of the application's APIs and hooks, along with usage examples and best practices.

## Text Style API

The Text Style API provides functions for managing text styles throughout the application.

### Style Store API

```typescript
interface TextStyleStore {
  // Retrieving styles
  getTextStyles(): TextStyle[];
  getLocalTextStyles(): TextStyle[];
  getDefaultStyle(): TextStyle | null;
  getStylesWithParent(parentId: string): TextStyle[];
  getStyleWithInheritance(styleId: string): TextStyle;
  getInheritanceChain(styleId: string): TextStyle[];
  
  // Modifying styles
  saveTextStyle(style: SaveTextStyleInput): string;
  saveLocalTextStyle(style: TextStyle): string;
  deleteTextStyle(styleId: string): boolean;
  duplicateTextStyle(styleId: string, newName?: string): string;
  setDefaultStyle(styleId: string | null): boolean;
  
  // CSS generation
  generateCSSFromTextStyles(styles?: TextStyle[]): string;
  
  // Cache management
  clearCachedStylesByPattern(pattern: string): void;
  clearDefaultResetStyle(): void;
  clearEditorCache(): void;
  resetTextStylesToDefaults(): void;
  deepCleanStorage(): void;
}
```

#### Usage Examples

Retrieving styles:

```typescript
import { textStyleStore } from '@/stores/textStyles';

// Get all available text styles
const allStyles = textStyleStore.getTextStyles();

// Get styles that inherit from a parent style
const childStyles = textStyleStore.getStylesWithParent('heading-1');

// Get a style with its inheritance resolved
const resolvedStyle = textStyleStore.getStyleWithInheritance('body-text');
```

Modifying styles:

```typescript
import { textStyleStore } from '@/stores/textStyles';

// Save a new style
const newStyleId = textStyleStore.saveTextStyle({
  name: 'Heading 1',
  fontFamily: 'Inter',
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#000000'
});

// Duplicate an existing style
const duplicatedId = textStyleStore.duplicateTextStyle(newStyleId, 'Heading 1 Copy');

// Delete a style
textStyleStore.deleteTextStyle(duplicatedId);
```

CSS generation:

```typescript
import { textStyleStore } from '@/stores/textStyles';

// Generate CSS for all styles
const css = textStyleStore.generateCSSFromTextStyles();

// Apply the CSS to a document
document.querySelector('#styles').innerHTML = css;
```

### Style Form Interface

```typescript
interface StyleFormData {
  id?: string;
  name: string;
  parentId?: string;
  selector?: string;
  description?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  color?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: string;
  textDecoration?: string;
  textTransform?: string;
}

interface StyleFormProps {
  initialValues?: Partial<StyleFormData>;
  onSubmit: (values: StyleFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}
```

## Template API

The Template API provides functions for managing document templates.

### Template Store API

```typescript
interface TemplateStore {
  // Retrieving templates
  getTemplates(): Template[];
  getTemplateById(id: string): Template | null;
  getTemplatesByCategory(category: string): Template[];
  
  // Modifying templates
  saveTemplate(template: SaveTemplateInput): string;
  deleteTemplate(templateId: string): boolean;
  duplicateTemplate(templateId: string, newName?: string): string;
  
  // Template application
  applyTemplateToDocument(templateId: string, documentId: string): boolean;
}
```

#### Usage Examples

Retrieving templates:

```typescript
import { templateStore } from '@/stores/templateStore';

// Get all available templates
const allTemplates = templateStore.getTemplates();

// Get templates in a specific category
const businessTemplates = templateStore.getTemplatesByCategory('business');

// Get a specific template
const letterTemplate = templateStore.getTemplateById('business-letter');
```

## Hooks Documentation

### Style Management Hooks

#### useTextStyles

```typescript
function useTextStyles(): {
  styles: TextStyle[];
  isLoading: boolean;
  error: Error | null;
  refreshStyles: () => void;
}
```

The `useTextStyles` hook provides access to all available text styles.

Usage example:

```typescript
import { useTextStyles } from '@/hooks/useTextStyles';

const StyleSelector = () => {
  const { styles, isLoading, error } = useTextStyles();
  
  if (isLoading) return <div>Loading styles...</div>;
  if (error) return <div>Error loading styles: {error.message}</div>;
  
  return (
    <select>
      {styles.map(style => (
        <option key={style.id} value={style.id}>
          {style.name}
        </option>
      ))}
    </select>
  );
};
```

#### useStyleForm

```typescript
function useStyleForm(
  initialValues?: Partial<StyleFormData>,
  onSubmit?: (values: StyleFormData) => void
): {
  values: StyleFormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleChange: (field: string, value: any) => void;
  handleBlur: (field: string) => void;
  handleSubmit: () => void;
  resetForm: () => void;
  isValid: boolean;
  isDirty: boolean;
}
```

The `useStyleForm` hook manages form state for creating and editing text styles.

Usage example:

```typescript
import { useStyleForm } from '@/hooks/useStyleForm';

const StyleEditor = ({ initialStyle, onSave }) => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isValid,
    isDirty
  } = useStyleForm(initialStyle, onSave);
  
  return (
    <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
      <div>
        <label>Style Name</label>
        <input
          value={values.name}
          onChange={e => handleChange('name', e.target.value)}
        />
        {errors.name && <div className="error">{errors.name}</div>}
      </div>
      
      {/* Other form fields */}
      
      <button type="submit" disabled={!isValid || !isDirty}>
        Save Style
      </button>
    </form>
  );
};
```

#### useStyleApplication

```typescript
function useStyleApplication(
  editor: Editor | null
): {
  applyStyle: (styleId: string) => boolean;
  removeStyles: () => boolean;
  getCurrentStyles: () => string[];
}
```

The `useStyleApplication` hook provides functions for applying text styles to editor content.

Usage example:

```typescript
import { useStyleApplication } from '@/hooks/useStyleApplication';

const StyleControls = ({ editor }) => {
  const { applyStyle, removeStyles, getCurrentStyles } = useStyleApplication(editor);
  const appliedStyles = getCurrentStyles();
  
  return (
    <div className="style-controls">
      <button onClick={() => applyStyle('heading-1')}>
        Heading 1
      </button>
      <button onClick={() => applyStyle('body-text')}>
        Body Text
      </button>
      <button onClick={removeStyles}>
        Clear Styles
      </button>
      
      <div>
        Applied styles: {appliedStyles.join(', ')}
      </div>
    </div>
  );
};
```

### Editor Hooks

#### useEditorSetup

```typescript
function useEditorSetup(
  options: {
    content: string;
    onContentChange: (content: string) => void;
    placeholder?: string;
    readOnly?: boolean;
  }
): {
  editor: Editor | null;
  isReady: boolean;
  currentFont: string;
  currentColor: string;
  handleFontChange: (font: string) => void;
  handleColorChange: (color: string) => void;
}
```

The `useEditorSetup` hook initializes and configures the rich text editor.

Usage example:

```typescript
import { useEditorSetup } from '@/hooks/useEditorSetup';

const DocumentEditor = ({ document, onUpdate }) => {
  const {
    editor,
    isReady,
    currentFont,
    currentColor,
    handleFontChange,
    handleColorChange
  } = useEditorSetup({
    content: document.content,
    onContentChange: (content) => onUpdate({ ...document, content })
  });
  
  if (!isReady) return <div>Loading editor...</div>;
  
  return (
    <div className="document-editor">
      <div className="toolbar">
        <FontSelect
          value={currentFont}
          onChange={handleFontChange}
        />
        <ColorPicker
          value={currentColor}
          onChange={handleColorChange}
        />
      </div>
      
      <EditorContent editor={editor} />
    </div>
  );
};
```

#### useFontSizeTracking

```typescript
function useFontSizeTracking(
  editor: Editor | null
): {
  fontSize: string;
  setFontSize: (size: string) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}
```

The `useFontSizeTracking` hook manages font size for the editor.

Usage example:

```typescript
import { useFontSizeTracking } from '@/hooks/useFontSizeTracking';

const FontSizeControl = ({ editor }) => {
  const {
    fontSize,
    setFontSize,
    increaseFontSize,
    decreaseFontSize
  } = useFontSizeTracking(editor);
  
  return (
    <div className="font-size-control">
      <button onClick={decreaseFontSize}>-</button>
      <input
        value={fontSize}
        onChange={e => setFontSize(e.target.value)}
      />
      <button onClick={increaseFontSize}>+</button>
    </div>
  );
};
```

### Document Hooks

#### useDocument

```typescript
function useDocument(
  documentId: string
): {
  document: Document | null;
  isLoading: boolean;
  error: Error | null;
  saveDocument: (updates: Partial<Document>) => Promise<boolean>;
  content: string;
  setContent: (content: string) => void;
  documentTitle: string;
  setDocumentTitle: (title: string) => void;
}
```

The `useDocument` hook manages document loading and saving.

Usage example:

```typescript
import { useDocument } from '@/hooks/useDocument';

const DocumentEditor = ({ documentId }) => {
  const {
    document,
    isLoading,
    error,
    content,
    setContent,
    documentTitle,
    setDocumentTitle,
    saveDocument
  } = useDocument(documentId);
  
  if (isLoading) return <div>Loading document...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!document) return <div>Document not found</div>;
  
  return (
    <div className="document-editor">
      <input
        value={documentTitle}
        onChange={e => setDocumentTitle(e.target.value)}
      />
      
      <RichTextEditor
        content={content}
        onUpdate={setContent}
      />
      
      <button onClick={() => saveDocument()}>
        Save Document
      </button>
    </div>
  );
};
```

## Best Practices

### Using Hooks

1. **Follow the Rules of Hooks** - Only call hooks at the top level of components or custom hooks
2. **Custom Hook Naming** - Prefix custom hooks with `use` (e.g., `useTextStyles`)
3. **Memoization** - Use `useMemo` and `useCallback` for performance optimization
4. **Dependencies** - Correctly specify dependencies in `useEffect`, `useMemo`, and `useCallback`

### Working with APIs

1. **Error Handling** - Always handle errors from API calls
2. **Loading States** - Display loading indicators during API operations
3. **Optimistic Updates** - Update UI optimistically for better user experience
4. **Caching** - Use caching strategies to reduce redundant API calls

### State Management

1. **State Lifting** - Lift state up only as far as necessary
2. **Context for Global State** - Use context for widely-shared state
3. **Local State** - Keep state local when possible
4. **State Slicing** - Split large state objects into manageable pieces
