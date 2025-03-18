# Text Style Inheritance System

**Last Updated:** 2023-11-15

## Overview

The Style Inheritance System enables styles to inherit properties from parent styles, creating a hierarchical relationship between text styles. This system is fundamental to maintaining consistent typography while allowing for specialized variations.

## Core Concepts

### Parent-Child Relationships

Styles can be organized into inheritance hierarchies where:
- **Parent styles** define base properties that are shared across multiple related styles
- **Child styles** inherit all properties from their parent, but can override specific properties
- Changes to parent styles automatically cascade down to all child styles

### Inheritance Chain

Styles can form inheritance chains of arbitrary depth:
- A root style (no parent) establishes base properties
- Intermediate styles inherit and modify some properties
- Leaf styles (no children) provide the most specialized styling

## Key Components

### InheritanceChain Component

Visualizes the inheritance relationships between styles:

```tsx
<InheritanceChain inheritanceChain={[parentStyle, currentStyle]} />
```

### StyleInheritanceSelect Component

Allows users to choose a parent style when creating or editing a style:

```tsx
<StyleInheritanceSelect
  styles={availableStyles}
  selectedStyleId={selectedParentId}
  onSelectStyle={handleParentChange}
  currentStyleId={currentStyleId}
/>
```

## Implementation Details

### Inheritance Resolution

When a style with inheritance is applied:

1. The system retrieves the complete inheritance chain using `getInheritanceChain()`
2. Properties are collected starting from the root style, with each child overriding specific properties
3. The final resolved style contains all properties, prioritizing the most specific (child) values

### Preventing Circular References

The system prevents circular references by:
- Validating parent selections to ensure a style cannot be its own ancestor
- Tracking the complete inheritance chain to detect cycles
- Providing visual feedback when invalid parent selections are attempted

## Data Flow

1. When a style is created or edited with a parent:
   - The `parentId` property is set to reference the parent style
   - The style is saved with this reference

2. When styles are loaded:
   - The `getStyleWithInheritance()` function resolves all inherited properties
   - The `getInheritanceChain()` function builds the complete inheritance path

3. When a parent style is updated:
   - All child styles are identified using `getStylesWithParent()`
   - Cached style data is cleared for affected styles
   - UI components showing these styles are updated

## Usage Example

```tsx
// Creating a style that inherits from another
const parentStyle = textStyleStore.getStyleById("heading-1");
const childStyle = {
  id: "subheading",
  name: "Subheading",
  parentId: parentStyle.id,
  // Override only specific properties
  fontSize: "18px",
  // Other properties are inherited from parent
};

// Saving the style with inheritance
textStyleStore.saveTextStyle(childStyle);

// Retrieving a style with all inherited properties resolved
const resolvedStyle = textStyleStore.getStyleWithInheritance(childStyle.id);
```

## Best Practices

1. **Create foundational styles first** - Establish base styles for major text elements
2. **Use shallow inheritance hierarchies** - Keep inheritance chains relatively short (3-4 levels max)
3. **Document inheritance relationships** - Use clear naming patterns to indicate relationships
4. **Override minimally** - Only override properties that need to differ from the parent
