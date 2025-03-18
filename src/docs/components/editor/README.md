
# Editor Components

**Last Updated:** 2023-11-15

## Overview

The Editor components provide the interface for creating and editing documents. These components are designed for users with the "editor" role and focus on content creation within templates.

## Key Components

- **EditorView**: The main container for the editor experience
- **EditorToolbar**: The toolbar specific to editors
- **DocumentPreview**: Renders the document with applied templates

## Architecture

See the [Editor Architecture](./EditorArchitecture.md) document for a detailed overview of the component hierarchy and interactions.

## Editor Toolbar

The EditorToolbar provides formatting controls appropriate for editors:

- **Text Controls**: Font and color selection
- **Format Controls**: Bold, italic, lists, etc.
- **Alignment Controls**: Text alignment options
- **Style Controls**: Style selection and application

## Document Workflow

The editor components support the following document workflow:

1. **Document Creation**:
   - Create a new document
   - Apply a template (optional)
   - Set document title

2. **Content Editing**:
   - Add and format content
   - Apply text styles
   - Format paragraphs and lists

3. **Document Management**:
   - Save documents
   - View document list
   - Delete documents

## State Management

Editor components use several custom hooks:

- **useDocument**: Manages document loading and saving
- **useEditorSetup**: Initializes the editor and manages state
- **useDocumentTitle**: Manages the document title

## Usage

```tsx
// In a document editor page
const {
  content,
  setContent,
  documentTitle,
  setDocumentTitle,
  saveDocument
} = useDocument(documentId);

return (
  <div>
    <DocumentTitle
      title={documentTitle}
      onChange={setDocumentTitle}
    />
    <EditorView
      content={content}
      onContentChange={setContent}
    />
    <DocumentControls
      onSave={saveDocument}
    />
  </div>
);
```

## Best Practices

1. **Template Integration**: Respect template styles and structure
2. **Role-Based UI**: Only show controls appropriate for editors
3. **Document Saving**: Implement auto-save or frequent save prompts
4. **Validation**: Validate content before saving
