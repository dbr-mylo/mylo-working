
# Designer Components

This directory contains components specific to the designer role in the application.

## Core Components

- `DesignerStandaloneView.tsx` - Main container for designer functionality
- `DesignerSidebar.tsx` - Sidebar with design tools
- `DesignerToolbar.tsx` - Designer-specific formatting toolbar
- `DocumentPreview.tsx` - Preview of document with design capabilities

## Typography Components

- `StyleEditor.tsx` - Edit text styles
- `StylesList.tsx` - List of available text styles
- `StyleListItem.tsx` - Individual style in the list
- `StyleInheritance.tsx` - Manage style inheritance
- `InheritanceChain.tsx` - Visualize style inheritance

## Toolbar Components

- `DesignerFormatButtonGroup.tsx` - Text formatting buttons
- `DesignerAlignmentButtonGroup.tsx` - Text alignment buttons
- `DesignerListButtonGroup.tsx` - List formatting buttons
- `DesignerIndentButtonGroup.tsx` - Indentation controls
- `DesignerStyleControls.tsx` - Style application controls
- `DesignerTextControls.tsx` - Text formatting controls

## Integration

Designer components maintain strict separation from editor components to prevent functionality conflicts. They include specialized behavior for template management and style inheritance.

## Usage

All designer components should:
1. Check for the designer role before rendering
2. Only be used in designer-specific contexts
3. Include appropriate error handling for incorrect usage
