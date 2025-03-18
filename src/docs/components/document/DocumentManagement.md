
# Document Management System

**Last Updated:** 2023-11-15

## Overview

The Document Management System handles the creation, loading, editing, and saving of documents. It provides hooks and utilities to manage document state, persistence, and communication with storage backends.

## Core Hooks

### useDocument

The primary hook for document management:
- Loads documents by ID
- Maintains document state
- Provides save functionality
- Tracks document changes

```typescript
const {
  content,
  setContent,
  initialContent,
  documentTitle,
  setDocumentTitle,
  currentDocumentId,
  isLoading,
  saveDocument,
  loadDocument
} = useDocument(documentId);
```

### useFetchDocument

Handles document retrieval:
- Fetches documents from Supabase or localStorage
- Updates document state
- Handles loading states and errors

### useSaveDocument

Manages document persistence:
- Saves documents to Supabase or localStorage
- Handles authenticated vs. guest saving
- Provides success/error feedback
- Updates document state after saving

### useLoadDocument

Facilitates loading existing documents:
- Processes document data
- Updates application state
- Handles role-specific document loading

## Storage Utilities

### documentFetchUtils

Utilities for retrieving documents:
- Functions to fetch from Supabase
- Functions to fetch from localStorage
- Role-specific document retrieval

### documentSaveUtils

Utilities for saving documents:
- Functions to save to Supabase
- Functions to save to localStorage
- Functions to handle drafts vs. published documents

## Role-Based Behavior

The document system adapts to user roles:

### Designer
- Works with templates instead of documents
- Different storage location and structure
- Template-specific metadata

### Editor
- Works with content documents
- May apply templates to documents
- Content-focused interface

### Admin
- Access to all documents and templates
- Additional management capabilities

## Document Structure

A document contains:

```typescript
interface Document {
  id: string;
  title: string;
  content: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  is_template?: boolean;
  template_id?: string;
  styles?: string;
}
```

## Usage

```tsx
// In a document editor component
const {
  content,
  setContent,
  documentTitle,
  setDocumentTitle,
  isLoading,
  saveDocument
} = useDocument(documentId);

// Save the document
const handleSave = async () => {
  await saveDocument();
};

// Render the editor with document content
return (
  <div>
    <input
      value={documentTitle}
      onChange={(e) => setDocumentTitle(e.target.value)}
    />
    <EditorContainer
      content={content}
      onContentChange={setContent}
    />
    <button onClick={handleSave}>Save</button>
  </div>
);
```

## Best Practices

1. **Frequent Saving**: Implement auto-save or prompt users to save frequently
2. **Validation**: Validate documents before saving to prevent empty or corrupted documents
3. **Error Handling**: Provide clear error messages when document operations fail
4. **Loading States**: Show appropriate loading indicators during document operations
5. **Role Awareness**: Always check user roles before performing document operations
