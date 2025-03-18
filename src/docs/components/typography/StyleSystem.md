
# Text Style System

**Last Updated:** 2023-11-15

## Overview

The Text Style System provides a comprehensive framework for managing typography styles throughout the application. It enables designers and editors to create, apply, and manage consistent text styles across documents.

## Core Components

The Style System consists of several key components that work together:

### Style Management
- **StyleForm**: The main component for creating and editing text styles
- **StyleFormMetadata**: Handles style naming and identification
- **StyleFormControls**: Provides UI controls for modifying style properties

### Style Inheritance
- **StyleInheritance**: Manages parent-child relationships between styles
- **InheritanceChain**: Visualizes the inheritance hierarchy

### Style Application
- **StyleApplicator**: Applies styles to selected text in the editor
- **StyleSelector**: Allows users to select and apply existing styles

## Data Flow

1. Styles are created or edited using the **StyleForm** component
2. Style data is stored in the text style store via **styleOperations**
3. Inheritance relationships are managed through the **StyleInheritance** system
4. CSS is generated from the style data using the **cssGenerator**
5. Styles are applied to the document using the **StyleApplicator**

## Style Inheritance

The style inheritance system allows styles to inherit properties from parent styles, creating a hierarchical relationship:

1. When a style inherits from another style, it adopts all properties of the parent
2. Child styles can override specific properties while maintaining others
3. Changes to parent styles cascade down to all children
4. The inheritance chain can be visualized through the **InheritanceChain** component

## CSS Generation

Styles are converted to CSS using the cssGenerator module:

1. Style properties are mapped to corresponding CSS properties
2. Inheritance is resolved by combining parent and child properties
3. CSS variables are generated for dynamic property changes
4. The final CSS is applied to the document through style tags

## Usage

```tsx
// Creating a new style
const { createStyle } = useStyleOperations();
createStyle({
  name: "Heading 1",
  fontFamily: "Inter",
  fontSize: "24px",
  fontWeight: "bold",
  color: "#000000"
});

// Applying a style to selected text
const { applyStyle } = useStyleApplication();
applyStyle("heading-1");
```

## Best Practices

1. **Naming Convention**: Use descriptive, role-based names for styles (e.g., "Body Text" rather than "16px Text")
2. **Inheritance Hierarchy**: Create a logical hierarchy with base styles for common properties
3. **Style Reuse**: Use the style system rather than inline formatting for consistency
4. **Style Organization**: Group related styles together in the hierarchy
