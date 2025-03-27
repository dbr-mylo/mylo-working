
# Role-Based Component Development Guide

This guide provides best practices and patterns for developing components that respect role-based access control in our application.

## Core Principles

1. **Single Source of Truth**: All role-checking logic is centralized in the `utils/roles` directory
2. **Consistency**: All components use the same hooks and patterns for role checking
3. **Backward Compatibility**: Support for legacy role names while transitioning to new naming
4. **Clear API**: Component wrappers with intuitive names and consistent behavior
5. **Early Validation**: Components should validate roles early and fail gracefully

## Role Hook Usage

### Basic Role Hooks

Always use these hooks for role checking:

```tsx
import { useIsWriter, useIsDesigner, useIsAdmin } from '@/utils/roles';

// In your component
const isWriter = useIsWriter();
const isDesigner = useIsDesigner();
const isAdmin = useIsAdmin();

// Use the boolean values for conditional rendering
return isWriter ? <WriterContent /> : null;
```

### Combined Role Hooks

For checking multiple roles:

```tsx
import { useIsWriterOrAdmin, useIsDesignerOrAdmin, useHasAnyRole } from '@/utils/roles';

// In your component
const isWriterOrAdmin = useIsWriterOrAdmin();
const isDesignerOrAdmin = useIsDesignerOrAdmin();
const hasRequiredRole = useHasAnyRole(['writer', 'designer']);

// Use the boolean values for conditional rendering
return isWriterOrAdmin ? <WriterOrAdminContent /> : null;
```

### Dynamic Value Selection Based on Role

```tsx
import { useRoleSpecificValue } from '@/utils/roles';

// Get a value specific to the user's role
const roleSpecificTitle = useRoleSpecificValue(
  'Designer Dashboard', // Designer value
  'Writer Workspace',   // Writer value
  'Admin Control Panel' // Admin value (optional)
);
```

## Role Component Wrappers

### Basic Role Components

Use these components to conditionally render content based on role:

```tsx
import { WriterOnly, DesignerOnly, AdminOnly } from '@/utils/roles';

// In your component
return (
  <>
    <WriterOnly>
      <p>This content is only visible to Writers</p>
    </WriterOnly>
    
    <DesignerOnly>
      <p>This content is only visible to Designers</p>
    </DesignerOnly>
    
    <AdminOnly>
      <p>This content is only visible to Admins</p>
    </AdminOnly>
  </>
);
```

### Providing Fallback Content

```tsx
import { WriterOnly } from '@/utils/roles';

// In your component
return (
  <WriterOnly fallback={<p>You need Writer access to see this content</p>}>
    <p>Writer-specific content here</p>
  </WriterOnly>
);
```

### Multi-Role Components

```tsx
import { MultiRoleOnly, WriterOrAdminOnly, DesignerOrAdminOnly } from '@/utils/roles';

// In your component
return (
  <>
    <MultiRoleOnly roles={['writer', 'designer']}>
      <p>Visible to both Writers and Designers</p>
    </MultiRoleOnly>
    
    <WriterOrAdminOnly>
      <p>Visible to Writers and Admins</p>
    </WriterOrAdminOnly>
    
    <DesignerOrAdminOnly>
      <p>Visible to Designers and Admins</p>
    </DesignerOrAdminOnly>
  </>
);
```

### Exclusion Pattern

```tsx
import { ExcludeRoles } from '@/utils/roles';

// In your component
return (
  <ExcludeRoles excludeRoles={['admin']}>
    <p>This content is hidden from Admins but visible to all other roles</p>
  </ExcludeRoles>
);
```

## Best Practices for Role-Based Components

### 1. Early Return Pattern

For role-specific components, always check the role at the beginning and return early:

```tsx
import { useIsWriter } from '@/utils/roles';

const WriterComponent = () => {
  const isWriter = useIsWriter();
  
  if (!isWriter) {
    console.warn("WriterComponent used outside of writer role context");
    return null;
  }
  
  return <div>Writer-specific implementation</div>;
};
```

### 2. Use Proper File Organization

- Place components in the appropriate role-specific directory
- Follow these naming patterns:
  - `src/components/writer/...` - Writer-specific components
  - `src/components/designer/...` - Designer-specific components
  - `src/components/admin/...` - Admin-specific components
  - `src/components/shared/...` - Role-agnostic components

### 3. Document Role Requirements

Add JSDoc comments to clearly indicate role requirements:

```tsx
/**
 * A component that allows designers to manage templates.
 * @requires Designer or Admin role
 */
const TemplateManager = () => {
  // Implementation
};
```

### 4. Test with All Relevant Roles

Every role-specific component should be tested with:
- The intended role(s) to verify it works correctly
- Other roles to verify it's properly hidden
- Edge cases like null/undefined roles

### 5. Use Consistent Styling for Access-Denied States

For custom access-denied states, use consistent styling:

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const AccessDenied = ({ requiredRole }) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Access Denied</AlertTitle>
    <AlertDescription>
      You need {requiredRole} access to view this content.
    </AlertDescription>
  </Alert>
);
```

## Handling Legacy Patterns

For backward compatibility, we support both `writer` and legacy `editor` roles:

```tsx
// These are equivalent
const isWriter = useIsWriter();
const isEditor = useIsEditor(); // Deprecated

// These are also equivalent
<WriterOnly>{content}</WriterOnly>
<EditorOnly>{content}</EditorOnly> // Deprecated
```

While both patterns work, prefer the new naming conventions (`writer`) for all new code.

## Troubleshooting Role Issues

1. **Component not showing for the right role**:
   - Verify that you're using the correct role hook
   - Check that the component is wrapped in the correct role wrapper
   - Make sure authentication is properly initialized

2. **Inconsistent role behavior**:
   - Ensure you're using role hooks from `@/utils/roles` not deprecated imports
   - Verify that the role in `AuthContext` is set correctly
   - Check for race conditions where role may not be loaded yet

3. **Functions not executing for the right role**:
   - Use the appropriate role-checking functions in guards
   - Consider using `hasAnyRole` for checking multiple roles

## Migration Guide for Old Components

When migrating old components to the new role system:

1. Replace direct `role === 'xyz'` checks with proper role hooks
2. Replace nested conditional rendering with role component wrappers
3. Move components to the appropriate role-specific directories
4. Add appropriate documentation and early returns
5. Test with all applicable roles

---

By following these guidelines, we ensure a consistent and maintainable approach to role-based UI components throughout the application.
