
# Role System Migration Guide

This document outlines the process for migrating components and code to the new role-based system.

## Why We're Migrating

The original role system had several issues:
1. Inconsistent naming (`editor` vs. `writer`)
2. Scattered role-checking logic across the codebase
3. Duplicated role components with slightly different implementations
4. No standardized patterns for role-based UI elements
5. Difficulty supporting both legacy and new role names simultaneously

The new system addresses these issues with a centralized approach, consistent naming, and backward compatibility.

## Key Changes

- All role-checking logic is now in the `utils/roles` directory
- Role hooks (e.g., `useIsWriter`) properly handle both "writer" and legacy "editor" roles
- Role components (e.g., `WriterOnly`) provide standardized conditional rendering
- Deprecated but supported legacy components and hooks maintain backward compatibility

## Step-by-Step Migration Process

### 1. Update Imports

**Before:**
```tsx
import { useIsEditor } from '@/utils/something';
import { EditorOnly } from '@/components/Editor/EditorOnly';
```

**After:**
```tsx
import { useIsWriter, WriterOnly } from '@/utils/roles';
```

### 2. Update Role Checks

**Before:**
```tsx
const { role } = useAuth();
const canAccess = role === 'editor' || role === 'admin';
```

**After:**
```tsx
const isWriterOrAdmin = useIsWriterOrAdmin();
const canAccess = isWriterOrAdmin;
```

### 3. Update Conditional Rendering

**Before:**
```tsx
{role === 'editor' && <EditorComponent />}
```

**After:**
```tsx
<WriterOnly>
  <EditorComponent />
</WriterOnly>
```

### 4. Implement Early Returns for Role-Specific Components

**Before:**
```tsx
const EditorComponent = () => {
  const { role } = useAuth();
  
  return (
    <>
      {role === 'editor' ? (
        <div>Editor content</div>
      ) : (
        <div>Access denied</div>
      )}
    </>
  );
};
```

**After:**
```tsx
const WriterComponent = () => {
  const isWriter = useIsWriter();
  
  if (!isWriter) {
    console.warn("WriterComponent used outside of writer role context");
    return null;
  }
  
  return <div>Writer content</div>;
};
```

### 5. Update Component Directory Structure

Move components to the appropriate role-specific directories:

- `src/components/writer/` for writer-specific components
- `src/components/designer/` for designer-specific components
- `src/components/shared/` for role-agnostic components

### 6. Test Thoroughly

For each migrated component:
1. Test with the intended role(s)
2. Test with other roles to ensure proper access control
3. Test edge cases like null/undefined roles
4. Verify backward compatibility if needed

## Common Migration Pitfalls

### Missed Legacy Role Handling

Ensure that both `writer` and legacy `editor` roles are supported:

```tsx
// Correct way to check for writer role (includes legacy 'editor')
const isWriter = useIsWriter();

// Incorrect way (misses legacy 'editor' role)
const { role } = useAuth();
const isWriter = role === 'writer';
```

### Nested Role Components

Avoid nesting role components with conflicting conditions:

```tsx
// Problematic - nested conditionals with conflicting roles
<DesignerOnly>
  <WriterOnly>
    <p>This will never be displayed!</p>
  </WriterOnly>
</DesignerOnly>

// Better - use MultiRoleOnly for complex conditions
<MultiRoleOnly roles={['designer', 'writer']}>
  <p>Visible to both designers and writers</p>
</MultiRoleOnly>
```

### Not Updating Route Guards

Remember to update role checks in route guards:

```tsx
// Old way
<Route 
  path="/editor" 
  element={role === 'editor' ? <EditorPage /> : <Navigate to="/access-denied" />} 
/>

// New way
<Route 
  path="/writer" 
  element={isWriter ? <WriterPage /> : <Navigate to="/access-denied" />} 
/>
```

## Verification Checklist

For each component you migrate:

- [ ] Update all imports to use the new role system
- [ ] Replace direct role checks with role hooks
- [ ] Replace conditional rendering with role components
- [ ] Implement early returns for role-specific components
- [ ] Update component directory structure if needed
- [ ] Add appropriate documentation
- [ ] Test with all applicable roles
- [ ] Verify backward compatibility if needed

## Support for Legacy Code

While we encourage migration to the new system, legacy patterns will continue to work:

- `useIsEditor()` redirects to `useIsWriter()`
- `EditorOnly` redirects to `WriterOnly`
- Direct role checks (e.g., `role === 'editor'`) still work but are discouraged

These compatibility layers will be maintained until all code is migrated, at which point they will be deprecated and eventually removed.

## Timeline

1. **Phase 1**: Initial migration of core components (completed)
2. **Phase 2**: Migration of non-critical components (in progress)
3. **Phase 3**: Removal of compatibility layers (future)
4. **Phase 4**: Cleanup and final removal of deprecated code (future)

## Getting Help

If you encounter issues during migration, refer to:
- The Role-Based Component Development Guide (`src/docs/ROLE_BASED_COMPONENT_GUIDE.md`)
- The Component Testing Framework (`src/components/toolbar/testing`)
- The Role System Documentation (`src/docs/ROLE_ARCHITECTURE.md`)

For specific issues, contact the Architecture team for assistance.
