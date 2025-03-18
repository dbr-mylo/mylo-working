
# StyleFormMetadata Component

**Last Updated:** 2023-07-20

## Purpose

The `StyleFormMetadata` component handles the metadata input fields for text styles, including the style name and parent style inheritance selection. It provides validation for style names to prevent duplicates and empty names.

## Usage

```tsx
import { StyleFormMetadata } from '@/components/design/typography/StyleFormMetadata';

<StyleFormMetadata
  name="Heading 1"
  parentId="parent-style-id"
  currentStyleId="current-style-id"
  onNameChange={handleNameChange}
  onParentChange={handleParentChange}
  parentStyle={parentStyle}
/>
```

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| name | string | - | Yes | The name of the style being edited |
| parentId | string \| undefined | - | No | ID of the parent style (if inheriting) |
| currentStyleId | string \| undefined | - | No | ID of the current style (if editing) |
| onNameChange | (value: string) => void | - | Yes | Handler for name change events |
| onParentChange | (parentId: string \| undefined) => void | - | Yes | Handler for parent style change events |
| parentStyle | TextStyle \| null \| undefined | - | No | The parent style object (if available) |

## Behavior

### Initialization
- Displays the current style name in an input field
- Shows the parent style selector if applicable

### Validation
- Uses the `useStyleNameValidator` hook to validate style names
- Checks for duplicate names in the style system
- Validates that names are not empty
- Displays error messages for invalid or duplicate names

### User Interactions
- Updates the style name when the user types in the input field
- Updates the parent style when a new parent is selected
- Shows/hides error messages based on validation results

## Dependencies

- `@/components/ui/label` - For input labels
- `@/components/ui/input` - For text input
- `@/components/ui/alert` - For information alerts
- `StyleInheritance` - For parent style selection
- `useStyleNameValidator` - Hook for name validation

## Related Components

- `StyleForm` - Parent component that uses StyleFormMetadata
- `StyleInheritance` - Component for selecting parent styles
- `StyleEditorModal` - Modal that contains the StyleForm

## Implementation Details

The component handles two key validation scenarios:
1. Checking for empty names (required field)
2. Checking for duplicate names within the style system

The validation is performed by the `useStyleNameValidator` hook, which returns:
- `isValid` - Whether the name is not empty
- `isDuplicate` - Whether the name is already used by another style
- `isChecking` - Whether the validation is in progress

Visual feedback is provided through UI elements:
- Red border on the input field for invalid or duplicate names
- Error messages with alert icons for specific validation errors
- Information alert about style inheritance when a parent style is selected
