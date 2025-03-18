
# Designer Components

**Last Updated:** 2023-11-15

## Overview

The Designer components provide the interface for creating and managing templates. These components are only available to users with the "designer" role and enable advanced design capabilities.

## Key Components

- **DesignerStandaloneView**: The main container for the designer experience
- **DesignerSidebar**: Side panel with design tools
- **DesignerToolbar**: Toolbar with formatting and design controls
- **TemplateManager**: Interface for managing templates

## Architecture

See the [Designer Components Overview](./DesignerComponentsOverview.md) for a detailed explanation of the component hierarchy and interactions.

## Designer Sidebar

The DesignerSidebar provides access to design tools through tabs:

- **Typography Panel**: Style creation and management
- **Template Panel**: Template dimensions and settings
- **Element Panel**: Selection properties and formatting

## Template Management

The template management components support:

- Creating new templates
- Setting template dimensions
- Defining template styles
- Managing template categories
- Publishing templates for editors

## Style Management

The style management components enable:

- Creating text styles
- Establishing inheritance relationships
- Previewing styles in the document
- Applying styles to content

## Usage

```tsx
// Render the designer view
<DesignerStandaloneView
  content={content}
  designContent={designContent}
  customStyles={templateStyles}
  isEditable={true}
  editorSetup={editorSetup}
  onContentChange={handleContentChange}
  onElementSelect={handleElementSelect}
/>
```

## Best Practices

1. **Template Structure**: Create templates with clear structure
2. **Style Inheritance**: Use inheritance for consistency
3. **Dimensions**: Set appropriate dimensions for output
4. **Placeholder Content**: Use meaningful placeholders
5. **Performance**: Minimize the number of styles
