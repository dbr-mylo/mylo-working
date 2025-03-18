
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
- Style creation and management:
  - Creating new text styles with the Style Editor
  - Managing style inheritance relationships
  - Previewing styles in real-time
- Font settings:
  - Font family selection with the Font Picker
  - Font size adjustments
  - Font weight selection
- Text formatting:
  - Color selection
  - Line height and letter spacing
  - Text alignment and decoration

### Template Panel
- Template dimensions:
  - Document size (letter, legal, A4, custom)
  - Width and height adjustments
  - Orientation (portrait or landscape)
- Background settings:
  - Background color
  - Background image
  - Page borders
- Page layout:
  - Margins
  - Columns
  - Headers and footers

### Element Panel
- Selection properties:
  - Currently selected element information
  - Element type (paragraph, heading, list, etc.)
  - Applied styles and formatting
- Element positioning:
  - Alignment
  - Indentation
  - Spacing
- Element formatting:
  - Style application
  - Direct formatting controls
  - Custom attributes

## Sidebar Advanced Features

### Style Management
The sidebar provides comprehensive style management:

1. **Style Creation**:
   - Create styles through the "New Style" button
   - Configure style properties in the modal form
   - Save styles to the style library

2. **Style Organization**:
   - View styles in a hierarchical list
   - Group styles by inheritance relationship
   - Filter styles by type or usage

3. **Style Maintenance**:
   - Reset styles to defaults
   - Clean style cache for troubleshooting
   - Delete or duplicate styles

4. **Style Application**:
   - Apply styles directly from the sidebar
   - View inheritance chain for applied styles
   - Edit styles and see changes in real-time

### Sidebar Control Operations

The DesignerSidebar component provides several control operations:

```typescript
// Create a new style
handleNewStyle();

// Edit an existing style
handleEditStyle(style);

// Reset styles to defaults
handleResetStyles();

// Clean all style caches
handleDeepClean();
```

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

## Sidebar Implementation

The DesignerSidebar is implemented as a flexible container with multiple sections:

```tsx
<div className="w-64 bg-editor-sidebar border-l border-editor-border p-4">
  <DesignerSidebarContainer title="Styles">
    <StylesList 
      onEditStyle={handleEditStyle} 
      editorInstance={editorInstance} 
    />
  </DesignerSidebarContainer>
  
  <DesignerSidebarContainer title="Settings">
    <p className="text-xs text-editor-text">No settings available yet</p>
  </DesignerSidebarContainer>
</div>
```

## Component Interaction

Designer components interact through several mechanisms:

1. **Prop passing** - For direct parent-child communication
2. **Editor instance** - For accessing editor state and commands
3. **Context providers** - For sharing state across component trees
4. **Custom events** - For loosely coupled components

## Best Practices

1. **Template Structure**: Create templates with clear structure and consistent styling
2. **Style Inheritance**: Use inheritance to create consistent style families
3. **Dimensions**: Set appropriate dimensions for the intended output format
4. **Placeholder Content**: Use meaningful placeholder content to guide editors
5. **Performance**: Minimize the number of styles to maintain good performance
6. **Sidebar Organization**: Keep sidebar panels focused and well-organized
7. **Role Separation**: Maintain clear separation between designer and editor interfaces

