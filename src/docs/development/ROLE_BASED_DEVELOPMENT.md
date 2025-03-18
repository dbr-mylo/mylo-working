
# Role-Based Development Guidelines

This document outlines best practices for developing with our role-based architecture.

## Role-Based Architecture

Our application supports different user roles (Designer and Editor) with distinct capabilities and UI experiences. This requires careful consideration during development.

## Key Principles

1. **Separation of Concerns**
   - Keep designer and editor code paths separate
   - Use role-specific components when functionality differs significantly
   - Avoid mixing role-specific logic within components

2. **Role-Based Rendering**
   - Use the provided role utility components:
     - `<DesignerOnly>` - Only renders content for designer role
     - `<EditorOnly>` - Only renders content for editor role
   - Use role hooks for conditional logic:
     - `useIsDesigner()` - Returns true if current role is designer
     - `useIsEditor()` - Returns true if current role is editor

3. **Shared Components**
   - Design shared components to handle both roles gracefully
   - Use role-specific props to customize behavior when needed
   - Document role-specific behaviors clearly

## Implementation Guidelines

1. **Component Structure**
   ```tsx
   // Preferred approach for role-specific rendering
   const MyComponent = () => {
     return (
       <div>
         <DesignerOnly>
           <DesignerSpecificContent />
         </DesignerOnly>
         <EditorOnly>
           <EditorSpecificContent />
         </EditorOnly>
         <SharedContent />
       </div>
     );
   };
   ```

2. **Conditional Logic**
   ```tsx
   // Preferred approach for conditional logic
   const MyComponent = () => {
     const isDesigner = useIsDesigner();
     
     // Process data differently based on role
     const processedData = useMemo(() => {
       if (isDesigner) {
         return processForDesigner(data);
       }
       return processForEditor(data);
     }, [data, isDesigner]);
     
     return <SomeComponent data={processedData} />;
   };
   ```

3. **Feature Flags**
   ```tsx
   // Use role-based feature flags
   import { hasFeatureAccess } from '@/utils/roleConfig';
   
   const MyComponent = () => {
     // Check if current role has access to a feature
     const canUseAdvancedFeature = hasFeatureAccess('advancedEditing');
     
     return (
       <div>
         {canUseAdvancedFeature && <AdvancedFeature />}
         <BasicFeature />
       </div>
     );
   };
   ```

## Common Pitfalls

1. **Avoid Modifying Designer Components**
   - Do not modify designer-specific components unless absolutely necessary
   - Designer components are marked with warning comments
   - Changes to designer components can break designer functionality

2. **Testing Both Roles**
   - Always test changes with both roles
   - Verify that changes to shared components don't break either role
   - Use role-specific testing utilities

3. **Documentation**
   - Document role-specific behavior clearly
   - Indicate which components are role-specific
   - Document role requirements for shared components
