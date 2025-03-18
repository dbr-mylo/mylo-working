
# Designer Components Overview

**Last Updated:** 2023-11-15

## Overview

The Designer components provide a specialized interface for template creation and design. These components are only available to users with the "designer" role and enable the creation of templates that can be used by editors to create documents.

## Core Components

### DesignerStandaloneView
The main container for the designer experience, incorporating:
- Document preview area
- Designer toolbar
- Designer sidebar

### DesignerToolbar
Specialized toolbar with design-specific controls:
- Text formatting options
- Style application
- Font size controls
- Alignment options

### DesignerSidebar
Side panel with design tools and options:
- Template management
- Style management
- Element properties

## Design Workflow

The designer interface supports the following workflow:

1. **Template Creation**:
   - Set template dimensions
   - Define base styles
   - Create layout elements

2. **Style Management**:
   - Create text styles
   - Establish inheritance relationships
   - Preview styles in the document

3. **Content Design**:
   - Add placeholder content
   - Apply styles to content
   - Configure element properties

4. **Template Publishing**:
   - Save the template
   - Make it available to editors

## State Management

Designer components use specialized stores and hooks:

### templateStore
Manages template data, including:
- Template dimensions
- Template styles
- Template metadata

### textStylesStore
Manages text styles used within templates:
- Style definitions
- Inheritance relationships
- Style application

## Designer Sidebar

The Designer Sidebar provides access to multiple design tools through tabs:

### Typography Panel
- Style creation and management
- Font settings
- Text formatting

### Template Panel
- Template dimensions
- Background settings
- Page layout

### Element Panel
- Selection properties
- Element positioning
- Element formatting

## Usage

The DesignerStandaloneView is the main entry point for the designer experience:

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

1. **Template Structure**: Create templates with clear structure and consistent styling
2. **Style Inheritance**: Use inheritance to create consistent style families
3. **Dimensions**: Set appropriate dimensions for the intended output format
4. **Placeholder Content**: Use meaningful placeholder content to guide editors
5. **Performance**: Minimize the number of styles to maintain good performance
