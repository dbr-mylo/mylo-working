
# Template Management System

**Last Updated:** 2023-11-15

## Overview

The Template Management System enables designers to create, edit, and manage templates that provide structure and styling for documents. Templates define the dimensions, styles, and layout that editors can use as a foundation for their content.

## Core Components

### TemplateManager

The main component for managing templates:

```tsx
<TemplateManager 
  onLoadTemplate={handleLoadTemplate}
  onClose={handleCloseTemplateManager}
/>
```

### TemplateControls

Controls for template operations:

```tsx
<TemplateControls
  template={currentTemplate}
  onSaveTemplate={handleSaveTemplate}
  onCreateTemplate={handleCreateTemplate}
  onDeleteTemplate={handleDeleteTemplate}
/>
```

### TemplateDimensions

Component for setting template dimensions:

```tsx
<TemplateDimensions
  width={templateWidth}
  height={templateHeight}
  onWidthChange={handleWidthChange}
  onHeightChange={handleHeightChange}
/>
```

### TemplateStyles

Component for managing template-specific styles:

```tsx
<TemplateStyles
  customStyles={customStyles}
  onStylesChange={handleStylesChange}
/>
```

## Template Workflow

The template management workflow includes:

### 1. Template Creation

1. Designer creates a new template
2. Sets template dimensions (letter, legal, custom, etc.)
3. Creates and applies text styles
4. Adds placeholder content
5. Saves the template

### 2. Template Organization

1. Templates can be categorized
2. Templates can be enabled or disabled
3. Templates can be previewed before selection

### 3. Template Application

1. Editors can select from available templates
2. Template dimensions and styles are applied to the document
3. Editors can add content while maintaining template styles

## Template Data Structure

Templates are stored with the following structure:

```typescript
interface Template {
  id: string;
  name: string;
  description?: string;
  dimensions: {
    width: string;
    height: string;
  };
  styles: string; // CSS styles
  content: string; // HTML content
  isEnabled: boolean;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
```

## Template Storage

Templates are managed through the `templateStore`:

```typescript
// Create or update a template
await templateStore.saveTemplate(template);

// Get all templates
const templates = await templateStore.getTemplates();

// Get a specific template
const template = await templateStore.getTemplateById(templateId);

// Delete a template
await templateStore.deleteTemplate(templateId);

// Toggle template status
await templateStore.toggleTemplateStatus(templateId, isEnabled);
```

## Template Dimensions

Templates support various dimension formats:

| Name | Width | Height | Description |
|------|-------|--------|-------------|
| Letter | 8.5in | 11in | Standard US letter size |
| Legal | 8.5in | 14in | US legal document size |
| A4 | 210mm | 297mm | Standard international size |
| Custom | Any | Any | User-defined dimensions |

Dimensions can be specified in various units:
- Inches (in)
- Millimeters (mm)
- Points (pt)
- Pixels (px)

## Template Styles

Templates include three types of styles:

1. **Text Styles** - Typography styles for text elements
2. **Layout Styles** - Styles for positioning and spacing
3. **Page Styles** - Styles for the page itself (margins, background, etc.)

These styles are combined into a single CSS string that is applied to the document.

## Template Content

Templates can include placeholder content to guide editors:

- Section headings
- Placeholder paragraphs
- Example formatting
- Guidance notes

This content is stored as HTML and can include style references.

## Role-Based Access

The template management system implements role-based access:

| Role | Create | View | Edit | Delete | Publish |
|------|--------|------|------|--------|---------|
| Admin | ✓ | ✓ | ✓ | ✓ | ✓ |
| Designer | ✓ | ✓ | ✓ | ✓ | ✓ |
| Editor | ✗ | ✓ | ✗ | ✗ | ✗ |

## Usage Example

```tsx
const TemplateManagementPage = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  const loadTemplates = async () => {
    const templates = await templateStore.getTemplates();
    setTemplates(templates);
  };
  
  const handleCreateTemplate = () => {
    // Navigate to template creation view
    navigate('/templates/new');
  };
  
  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };
  
  return (
    <div>
      <h1>Template Management</h1>
      <Button onClick={handleCreateTemplate}>Create New Template</Button>
      
      <TemplateManager
        templates={templates}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
};
```

## Best Practices

1. **Use meaningful names** - Give templates descriptive names
2. **Standard dimensions** - Use standard paper sizes when possible
3. **Preview templates** - Always preview templates before publishing
4. **Document template purpose** - Add descriptions to templates
5. **Limit styles per template** - Keep the number of styles manageable

