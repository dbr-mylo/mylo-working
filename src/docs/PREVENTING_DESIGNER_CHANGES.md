
# Preventing Changes to Designer Components

This document outlines the strategies implemented to prevent accidental modifications to designer-specific functionality.

## 1. Role-Based Component Structure

All components are now organized with clear role separation:
- `src/components/designer/...` - Designer-specific components
- `src/components/editor/...` - Writer-specific components
- `src/components/rich-text/...` - Shared rich text editor functionality

## 2. Role-Specific Utility Hooks

The system now uses dedicated hooks for role checking:
- `useIsDesigner()` - Check if current user has designer role
- `useIsWriter()` - Check if current user has writer role
- `useIsAdmin()` - Check if current user has admin role
- `useHasAnyRole([roles])` - Check if user has any of the specified roles

## 3. Early Return Pattern

All role-specific components now include early returns with warning logs:
```tsx
const MyDesignerComponent = () => {
  const isDesigner = useIsDesigner();
  
  if (!isDesigner) {
    console.warn("MyDesignerComponent used outside of designer role context");
    return null;
  }
  
  // Designer-specific functionality
};
```

## 4. Role-Based Conditional Rendering

Higher-level components now conditionally render based on user role:
```tsx
const DocumentContent = () => {
  const isDesigner = useIsDesigner();
  const isWriter = useIsWriter();
  
  if (isDesigner) {
    return <DesignerView />;
  }
  
  if (isWriter) {
    return <WriterView />;
  }
  
  return <AccessDenied />;
};
```

## 5. Role-Specific Component Wrappers

Specialized components are available for role-based rendering:
- `<DesignerOnly>` - Only renders content for designer role
- `<WriterOnly>` - Only renders content for writer role
- `<AdminOnly>` - Only renders content for admin role
- `<MultiRoleOnly roles={['designer', 'admin']}>` - Renders for multiple roles

## 6. Warning Documentation

All designer components now include warning comments:
```tsx
/**
 * WARNING: CORE DESIGNER COMPONENT
 * This component is specifically for the designer role and should not be modified
 * unless absolutely necessary. Changes here directly impact the designer experience.
 */
```

## Best Practices

When developing new features:

1. Always use the role-specific hooks for role checks
2. Place components in the correct role-specific directories
3. Use early returns with console warnings
4. Add appropriate warning comments to designer components
5. Test all changes with both designer and writer roles
6. Use the role-specific component wrappers when possible
