
# Role-Based Architecture

This document provides an overview of the role-based architecture implemented in the application.

## Overview

The application supports three primary user roles:

- **Designer**: Users responsible for creating and managing templates and typography styles
- **Writer**: Users who create and edit document content using the templates and styles
- **Admin**: Users with access to both designer and writer functionality plus additional administrative capabilities

## Role Management

Roles are implemented using:

1. A centralized `AuthContext` that stores the user's current role
2. Role-specific utility hooks to check the current user's role
3. Component wrappers to conditionally render UI based on roles

## Directory Structure

The codebase is organized to separate role-specific components:

```
src/
├── components/
│   ├── designer/        # Designer-specific components
│   │   ├── core/        # Core designer components
│   │   ├── toolbar/     # Designer-specific toolbar components
│   │   ├── typography/  # Typography styling components
│   │   └── preview/     # Preview components for designers
│   ├── editor/          # Writer-specific components
│   │   └── toolbar/     # Writer-specific toolbar components
│   └── rich-text/       # Shared rich text editor functionality
├── utils/
│   └── roles/           # Role utility functions, hooks, and components
│       ├── RoleHooks.tsx        # Role-specific hooks
│       ├── RoleComponents.tsx   # Role-specific component wrappers
│       ├── RoleFunctions.tsx    # Role utility functions
│       └── types.ts             # TypeScript types for roles
```

## Key Components

### Role Utility Hooks

```tsx
import { useIsDesigner, useIsWriter, useIsAdmin } from '@/utils/roles';

const MyComponent = () => {
  const isDesigner = useIsDesigner();
  const isWriter = useIsWriter();
  const isAdmin = useIsAdmin();
  
  // Use role information to render appropriate UI
};
```

### Role-Specific Component Wrappers

```tsx
import { DesignerOnly, WriterOnly, AdminOnly } from '@/utils/roles';

const MyComponent = () => {
  return (
    <>
      <DesignerOnly>
        <DesignerSpecificContent />
      </DesignerOnly>
      
      <WriterOnly>
        <WriterSpecificContent />
      </WriterOnly>
      
      <AdminOnly>
        <AdminSpecificContent />
      </AdminOnly>
    </>
  );
};
```

### Multi-Role Component Wrappers

```tsx
import { MultiRoleOnly, DesignerOrAdminOnly, WriterOrAdminOnly } from '@/utils/roles';

const MyComponent = () => {
  return (
    <>
      <MultiRoleOnly roles={['designer', 'writer']}>
        <ContentForBothRoles />
      </MultiRoleOnly>
      
      <DesignerOrAdminOnly>
        <ManagementContent />
      </DesignerOrAdminOnly>
      
      <WriterOrAdminOnly>
        <ContentCreationTools />
      </WriterOrAdminOnly>
    </>
  );
};
```

## Best Practices

1. **Early Return Pattern**: Role-specific components should check the user's role at the beginning and return early if not applicable

```tsx
const DesignerComponent = () => {
  const isDesigner = useIsDesigner();
  
  if (!isDesigner) {
    console.warn("DesignerComponent used outside of designer role context");
    return null;
  }
  
  // Designer-specific implementation
};
```

2. **Consistent Naming**: Follow these naming conventions:
   - Designer components: `Designer[ComponentName]`
   - Writer components: `Editor[ComponentName]`
   - Shared components: `[ComponentName]`

3. **Role-Specific Directories**: Place components in the appropriate role-specific directory

4. **Warning Comments**: Add warning comments to designer components

```tsx
/**
 * WARNING: CORE DESIGNER COMPONENT
 * This component is specifically for the designer role and should not be modified
 * unless absolutely necessary. Changes here directly impact the designer experience.
 */
```

5. **Testing**: Test all components with all applicable roles before merging changes

## Legacy Support

The application still contains some legacy code that uses:
- `useIsEditor()` instead of `useIsWriter()`
- `EditorOnly` instead of `WriterOnly`

These are maintained for backward compatibility but should be migrated to the new naming in future updates.
