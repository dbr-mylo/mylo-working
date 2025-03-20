
# Designer Components Documentation

This document outlines components and files specifically related to the designer role functionality.
These files should NOT be modified without careful consideration of how changes might affect the designer experience.

## Core Designer Components

- `src/components/designer/core/DesignerStandaloneView.tsx` - Main view for designer role
- `src/components/designer/core/DesignerSidebar.tsx` - Sidebar specifically for designers
- `src/components/designer/template/TemplateManager.tsx` - Manages templates for designers
- `src/components/designer/typography/*` - All typography styling components for designers
- `src/components/designer/preview/DocumentPreview.tsx` - Handles editable content with special designer mode

## Legacy Paths (Deprecated)

The following paths have been deprecated and will be removed in a future update:
- `src/components/design/DesignerStandaloneView.tsx`
- `src/components/design/DesignerSidebar.tsx`
- `src/components/design/typography/*`

## Important Note

When working with components that have role-based conditional rendering, always preserve the designer role functionality.
Use the `isDesigner` condition checks to maintain separation between the roles.
