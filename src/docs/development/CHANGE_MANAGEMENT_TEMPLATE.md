
# Change Management Template

**Last Updated:** 2023-11-25

## Overview

This template provides a structured approach for implementing changes to components, hooks, and other parts of the application. Follow these steps for every significant change to ensure stability, testability, and maintainability.

## Pre-Change Assessment

Before making any changes, complete the following documentation:

### 1. Current Behavior Documentation

```markdown
## Current Behavior

### Component/Feature: [NAME]

**Current Functionality:**
- [List all features and behaviors]
- [Include screenshots if relevant]

**Known Limitations or Bugs:**
- [Document any existing issues]

**User Flows:**
- [Document how users interact with this feature]
```

### 2. Dependency Analysis

```markdown
## Dependencies

### Direct Dependencies:
- Components: [List components that directly use or are used by the target]
- Hooks: [List hooks that are used by or use the target]
- Stores/Services: [List any data stores or services involved]

### Shared State:
- [Document any state that is shared between components]
- [Note how state changes propagate]

### API Contracts:
- [Document the props/parameters interface]
- [Document the return values/rendered output]
```

### 3. Test Plan

```markdown
## Test Plan

### Success Criteria:
- [Define what "working correctly" means for this change]

### Test Cases:
1. [Test case description]
   - Expected outcome: [What should happen]
   - Test method: [How to verify]

2. [Additional test cases...]

### Edge Cases:
- [List edge cases that need testing]
```

## Implementation Strategy

### 1. Test Component Approach

Create a temporary component with a "Test" prefix to safely develop and test changes:

```tsx
// Original component remains untouched
// Create test component with planned changes
export const TestComponentName = (props) => {
  // Implementation with changes
};

// In parent component that uses ComponentName:
{useTestVersion ? (
  <TestComponentName {...props} />
) : (
  <ComponentName {...props} />
)}
```

Benefits of this approach:
- Original component remains functional throughout development
- Can easily toggle between implementations for comparison
- Provides a clean sandbox for implementing changes
- Allows for incremental testing without affecting production functionality

### 2. Incremental Implementation

Document each step of the implementation:

```markdown
## Implementation Steps

1. [ ] Create test component/hook
2. [ ] Implement basic functionality
   - [ ] Sub-task 1
   - [ ] Sub-task 2
3. [ ] Add feature A
4. [ ] Test feature A
5. [ ] Add feature B
6. [ ] Test feature B
7. [ ] Integration test
8. [ ] Replace original component
```

### 3. Integration Plan

```markdown
## Integration Plan

1. [ ] Verify all tests pass with test component
2. [ ] Create PR with both versions for comparison
3. [ ] Conduct side-by-side testing
4. [ ] Replace original implementation
5. [ ] Final verification
```

## Rollback Plan

```markdown
## Rollback Plan

### Trigger Conditions:
- [Define conditions that would require rollback]

### Rollback Steps:
1. [ ] Revert to original component
2. [ ] Verify original functionality still works
3. [ ] Document issues encountered

### Learning Items:
- [Document what was learned for future changes]
```

## Change Documentation

After implementing the change, update the following documentation:

```markdown
## Change Documentation

### What Changed:
- [Describe the changes made]

### Why It Changed:
- [Explain the reasons for the change]

### Migration Guide:
- [If applicable, provide guidance for adapting to the change]
```

## Verification Checklist

```markdown
## Verification Checklist

- [ ] All tests pass
- [ ] Component documentation updated
- [ ] No regressions in dependent components
- [ ] UI matches design specifications
- [ ] Accessibility requirements met
- [ ] Code follows project style guidelines
- [ ] PR description includes change summary
```

## Example: Changing the AuthContext Component

```markdown
## Current Behavior

### Component/Feature: AuthContext

**Current Functionality:**
- Provides authentication state to the application
- Handles user sign-in, sign-up, and sign-out
- Manages guest role functionality
- Tracks loading and error states

**Known Limitations:**
- Guest role persistence has no expiration
- Error handling doesn't support retries

**User Flows:**
- User signs in with email/password
- User signs out
- User continues as guest with specific role

## Dependencies

### Direct Dependencies:
- Components: ExternalActions, GuestRoleButtons, ProtectedRoutes
- Hooks: useGuestRole, useAuthState, useAuthActions, useUserData
- Services: Supabase auth service

### Shared State:
- Authentication state (user, role, isLoading, error)
- Guest role state stored in localStorage

### API Contracts:
- AuthContextType defines the context interface
- signIn, signUp, signOut methods return Promises
- clearGuestRole must return boolean

## Test Plan

### Success Criteria:
- All authentication flows work as before
- Type errors are resolved
- Guest role is properly cleared on sign-out

### Test Cases:
1. User sign-in with valid credentials
   - Expected: User authenticated, redirected to home
   - Test: Submit sign-in form with test account

2. Guest role selection
   - Expected: Guest role saved, user has expected permissions
   - Test: Click guest role button, verify role set

3. Sign-out from authenticated state
   - Expected: Session cleared, user redirected to auth page
   - Test: Click sign-out, verify redirect and state reset

4. Sign-out from guest role
   - Expected: Guest role cleared, returns to auth page
   - Test: Set guest role, sign out, verify role cleared

### Edge Cases:
- Expired session handling
- Network errors during auth operations
- Invalid role assignments

## Implementation Steps

1. [x] Create TestAuthContext component
2. [ ] Fix type definition for clearGuestRole
3. [ ] Test guest role clearing functionality
4. [ ] Implement session expiration for guest roles
5. [ ] Verify all auth flows with test component
6. [ ] Replace original implementation
```

## Example: Test Component for Style Editor Modal

```markdown
## Implementation Steps

1. [x] Create TestStyleEditorModal component
2. [ ] Implement basic modal functionality
   - [x] Opening/closing behavior
   - [x] Dialog title and content structure
   - [ ] Form rendering
3. [ ] Add validation
   - [ ] Required fields
   - [ ] Name uniqueness check
4. [ ] Add save/cancel functionality
   - [ ] Loading states during save
   - [ ] Success/error toasts
   - [ ] Prevent close during save
5. [ ] Test style inheritance features
6. [ ] Verify integration with StyleForm
7. [ ] Compare with original implementation
8. [ ] Replace original StyleEditorModal
```

## Example: Using Feature Flags for Safe Integration

For complex components that affect critical user flows, consider using a feature flag approach:

```tsx
// In a central feature flag configuration
const FEATURES = {
  USE_NEW_STYLE_EDITOR: process.env.NODE_ENV === 'development' || false
};

// In the parent component
{FEATURES.USE_NEW_STYLE_EDITOR ? (
  <TestStyleEditorModal {...props} />
) : (
  <StyleEditorModal {...props} />
)}
```

This approach allows for:
- Easy toggling between implementations
- Staged rollout to specific environments
- Quick rollback if issues are discovered
