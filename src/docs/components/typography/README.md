
# Typography Components

This section documents the components related to typography and text styling.

## Core Components

- [StyleForm](./StyleForm.md) - Form for creating and editing text styles
- [StyleFormMetadata](./StyleFormMetadata.md) - Component for style name and inheritance
- [StyleFormControls](./StyleFormControls.md) - Controls for typography properties
- [StyleInheritance](./StyleInheritance.md) - Component for managing style inheritance
- [TextPreview](./TextPreview.md) - Preview component for text styles

## Style Management Components

- [StyleBrowser](./StyleBrowser.md) - Component for browsing available styles
- [StyleSelector](./StyleSelector.md) - Component for selecting styles
- [StyleListItem](./StyleListItem.md) - Individual style item in lists
- [StyleEditorModal](./StyleEditorModal.md) - Modal for editing styles

## Style Application Components

- [StyleApplicator](./StyleApplicator.md) - Applies styles to text content
- [StyleContextMenu](./StyleContextMenu.md) - Context menu for style operations

## Hooks

- [useStyleForm](./hooks/useStyleForm.md) - Hook for managing style form state
- [useStyleNameValidator](./hooks/useStyleNameValidator.md) - Hook for validating style names
- [useStyleInheritance](./hooks/useStyleInheritance.md) - Hook for handling style inheritance
- [useTextStyles](./hooks/useTextStyles.md) - Hook for accessing text styles

## System Architecture

The typography system is built around these key concepts:

1. **Style Definition** - Creating and editing text styles
2. **Style Inheritance** - Parent-child relationships between styles
3. **Style Application** - Applying styles to text content
4. **Style Management** - Organizing and accessing styles

See the [Typography System Architecture](../../architecture/TYPOGRAPHY_SYSTEM.md) document for a deeper dive into how these components work together.
