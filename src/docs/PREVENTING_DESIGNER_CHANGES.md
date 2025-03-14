
# Preventing Changes to Designer Components

This document outlines the strategies implemented to prevent accidental modifications to designer-specific functionality.

## 1. Warning Comments

All designer-related components now include prominent warning comments at the top of the file. These comments clearly indicate which parts of the code should not be modified, especially sections that handle the designer role.

Example:
```tsx
/**
 * WARNING: This component contains role-specific rendering logic.
 * Changes to the designer role functionality (isDesigner === true) should be avoided.
 * Only modify the editor role section unless absolutely necessary.
 */
```

## 2. Role-Specific Rendering Utilities

We've implemented utility components and hooks in `src/utils/roleSpecificRendering.tsx` to enforce separation between designer and editor code paths:

- `<DesignerOnly>` and `<EditorOnly>` components
- `useIsDesigner()` and `useIsEditor()` hooks
- `useRoleSpecificValue()` hook for role-based values
- `renderForRole()` function for conditional rendering

## 3. Role-Based Feature Flags

The `src/utils/roleConfig.ts` file provides a centralized configuration system for role-specific features:

- Feature flags indicate which functionality is available to which role
- Helper functions to check role permissions
- Prevents accidental enabling of designer features for editors

## 4. Documentation

A detailed documentation file at `src/docs/DESIGNER_COMPONENTS.md` lists all designer-specific components that should not be modified.

## 5. Git Hook Protection

A pre-commit hook script at `.github/designer-protect.js` can be installed to prevent accidental commits that modify designer files.

## Best Practices

When working with components that support both roles:

1. Always use the role-specific utilities and hooks
2. Maintain clear separation between designer and editor code paths
3. When in doubt, use the `<DesignerOnly>` or `<EditorOnly>` components
4. Test all changes with both roles before committing

## Installing the Git Hook

To enable the git hook protection:

1. Copy `.github/designer-protect.js` to `.git/hooks/pre-commit`
2. Make it executable: `chmod +x .git/hooks/pre-commit`

This will prevent accidental commits that modify designer files.
