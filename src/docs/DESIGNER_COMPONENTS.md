
# Designer Components Documentation

This document outlines components and files specifically related to the designer role functionality.
These files should NOT be modified without careful consideration of how changes might affect the designer experience.

## Core Designer Components

- `src/components/design/DesignerStandaloneView.tsx` - Main view for designer role
- `src/components/design/DesignerSidebar.tsx` - Sidebar specifically for designers
- `src/components/design/TemplateManager.tsx` - Manages templates for designers
- `src/components/design/typography/*` - All typography styling components for designers
- `src/components/design/preview/EditableContent.tsx` - Handles editable content with special designer mode
- `src/components/rich-text/EditorContainer.tsx` - Container with special handling for designer role

## Important Note

When working with components that have role-based conditional rendering, always preserve the designer role functionality.
Use the `isDesigner` condition checks to maintain separation between the roles.
