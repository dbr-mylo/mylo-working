
# Designer Components Documentation

This document outlines components and files specifically related to the designer role functionality.
These files should NOT be modified without careful consideration of how changes might affect the designer experience.

## Core Designer Components

- `src/components/designer/core/DesignerStandaloneView.tsx` - Main view for designer role
- `src/components/designer/core/DesignerSidebar.tsx` - Sidebar specifically for designers
- `src/components/designer/toolbar/DesignerToolbar.tsx` - Designer-specific toolbar
- `src/components/designer/toolbar/DesignerStyleControls.tsx` - Style controls for designers
- `src/components/designer/toolbar/DesignerFormatButtonGroup.tsx` - Format buttons for designers
- `src/components/designer/toolbar/DesignerListButtonGroup.tsx` - List controls for designers
- `src/components/designer/toolbar/DesignerAlignmentButtonGroup.tsx` - Alignment controls for designers
- `src/components/designer/toolbar/DesignerIndentButtonGroup.tsx` - Indentation controls for designers
- `src/components/designer/toolbar/DesignerClearFormattingButton.tsx` - Clear formatting for designers
- `src/components/designer/preview/DocumentPreview.tsx` - Handles editable content with special designer mode
- `src/components/designer/typography/*` - All typography styling components for designers

## Writer (Editor) Components

- `src/components/editor/toolbar/EditorToolbar.tsx` - Writer-specific toolbar
- `src/components/editor/toolbar/EditorFormatButtonGroup.tsx` - Format buttons for writers
- `src/components/editor/toolbar/EditorListButtonGroup.tsx` - List controls for writers
- `src/components/editor/toolbar/EditorAlignmentButtonGroup.tsx` - Alignment controls for writers
- `src/components/editor/toolbar/EditorIndentButtonGroup.tsx` - Indentation controls for writers
- `src/components/editor/toolbar/EditorClearFormattingButton.tsx` - Clear formatting for writers

## Role Utility Files

- `src/utils/roles/RoleHooks.tsx` - Role-specific hooks
- `src/utils/roles/RoleComponents.tsx` - Role-specific component wrappers
- `src/utils/roles/RoleFunctions.tsx` - Role-specific utility functions
- `src/utils/roles/types.ts` - TypeScript types for role components and hooks

## Important Usage Patterns

### Role-checking hooks:
```tsx
// Always use these hooks to check role
const isDesigner = useIsDesigner();
const isWriter = useIsWriter();
```

### Role-specific component wrappers:
```tsx
// Use these component wrappers for conditionally rendering content
<DesignerOnly>
  <DesignerSpecificContent />
</DesignerOnly>

<WriterOnly>
  <WriterSpecificContent />
</WriterOnly>
```

### Conditional rendering with functions:
```tsx
// Use renderForRole for more complex conditional rendering
{renderForRole(role, {
  designer: <DesignerView />,
  writer: <WriterView />,
  admin: <AdminView />
})}
```

## Legacy Paths (Deprecated)

The following paths have been deprecated and will be removed in a future update:
- `src/components/design/DesignerStandaloneView.tsx`
- `src/components/design/DesignerSidebar.tsx`
- `src/components/design/typography/*`
- `src/utils/roleSpecificRendering.tsx`

## Recommended Process for Adding New Features

When implementing new features that need to work across roles:

1. Determine which roles need access to the feature
2. Create separate component implementations if behavior differs significantly
3. Use the role-specific hooks for conditional logic
4. Test thoroughly with all supported roles
5. Add appropriate documentation warnings for designer components
