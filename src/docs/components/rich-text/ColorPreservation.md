
# Color Preservation System

**Last Updated:** 2023-11-15

## Overview

The Color Preservation System ensures that text formatting operations (like bold, italic, lists) maintain the text color instead of reverting to default colors. This is crucial for maintaining consistent styling when applying multiple formatting options.

## Components

### ColorPreservationStyles

A component that injects critical CSS rules to ensure color is preserved across formatting operations:
- Forces nested elements to inherit parent color
- Overrides browser defaults for formatted text
- Handles special cases for combined formatting

## Utility Functions

### preserveColorAfterFormatting

A utility function that ensures color is preserved when applying formatting:

```typescript
preserveColorAfterFormatting(editor, () => {
  editor.chain().focus().toggleBold().run();
}, currentColor);
```

### handleBoldWithColorPreservation

A specialized function for bold formatting with color preservation:

```typescript
handleBoldWithColorPreservation(editor, currentColor);
```

## Implementation Details

The system works through several mechanisms:

### 1. CSS Inheritance Rules

The ColorPreservationStyles component injects CSS rules that force color inheritance:

```css
.ProseMirror * {
  color: inherit;
}

.ProseMirror strong,
.ProseMirror b,
.ProseMirror em,
.ProseMirror i {
  color: inherit !important;
}
```

### 2. Custom Bold Extension

A modified Bold extension that adds a special class for color preservation:

```typescript
const ColorPreservingBold = Bold.configure({
  HTMLAttributes: {
    class: 'color-preserving-bold',
  }
});
```

### 3. Wrapper Functions

Wrapper functions that:
- Apply formatting commands
- Re-apply the current color if needed
- Handle edge cases for specific formatting operations

## Usage

In formatting buttons:

```tsx
<Button
  onClick={() => handleBoldWithColorPreservation(editor, currentColor)}
  className={editor.isActive('bold') ? 'bg-gray-100' : ''}
>
  <Bold className="h-3.5 w-3.5" />
</Button>

<Button
  onClick={() => preserveColorAfterFormatting(
    editor, 
    () => editor.chain().focus().toggleItalic().run(), 
    currentColor
  )}
  className={editor.isActive('italic') ? 'bg-gray-100' : ''}
>
  <Italic className="h-3.5 w-3.5" />
</Button>
```

## Best Practices

1. **Always Use Wrappers**: Use the provided wrapper functions for formatting operations
2. **Include ColorPreservationStyles**: Ensure the styles component is included in the editor
3. **Custom Extensions**: When creating custom formatting extensions, follow the pattern of the ColorPreservingBold extension
4. **Test Combined Formatting**: Always test combinations of formatting (bold+italic, colored lists, etc.)
