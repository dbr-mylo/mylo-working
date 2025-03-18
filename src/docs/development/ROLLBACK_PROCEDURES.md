# Rollback Procedures

**Last Updated:** 2023-11-20

## Overview

This document outlines procedures for safely rolling back changes when issues are discovered after implementation. These procedures help minimize disruption and ensure a quick return to a stable state.

## Rollback Decision Criteria

Consider rolling back changes when:

1. **Critical Bugs** - Issues that prevent core functionality from working
2. **Data Corruption** - Issues that could corrupt user data
3. **Performance Issues** - Severe performance degradation
4. **Security Vulnerabilities** - Any security issues introduced

## Pre-Implementation Preparation

Before implementing changes, prepare for potential rollbacks:

1. **Document Current State** - Record the current working state
2. **Create Backup Branches** - Maintain a stable branch before changes
3. **Define Rollback Criteria** - Set clear criteria for when to roll back
4. **Test Rollback Process** - Verify rollback procedures work

## Component-Level Rollback

For isolated component changes:

### 1. Component Replacement Rollback

When a component has been replaced:

```tsx
// Step 1: Revert to the original component
import { OriginalStyleEditorModal } from './backup/OriginalStyleEditorModal';

// Step 2: Replace the new component with the original
export { OriginalStyleEditorModal as StyleEditorModal };
```

### 2. Component Modification Rollback

When a component has been modified:

```tsx
// Step 1: Revert changes to the component
// Remove new code and restore original implementation
const StyleForm = ({ initialValues, onSubmit }) => {
  // Revert to original implementation
};
```

## Feature-Level Rollback

For larger feature changes:

### 1. Feature Flag Rollback

When features are behind feature flags:

```tsx
// Step 1: Disable the feature flag
const FEATURES = {
  // Set the feature flag to false
  NEW_STYLE_EDITOR: false,
  // ...other features
};

// Step 2: Use conditional rendering
const Editor = () => {
  return (
    <div>
      {FEATURES.NEW_STYLE_EDITOR ? (
        <NewStyleEditor />
      ) : (
        <OriginalStyleEditor />
      )}
    </div>
  );
};
```

### 2. Route-Based Rollback

When features are tied to specific routes:

```tsx
// Step 1: Update the route configuration
const routes = [
  // Point the route to the original component
  { path: '/styles', component: OriginalStyleManager },
  // ...other routes
];
```

## State Management Rollback

For state management changes:

### 1. Store Version Rollback

When stores have been modified:

```tsx
// Step 1: Restore the original store implementation
import { originalTextStyleStore } from './backup/originalTextStyleStore';

// Step 2: Export the original store instead of the new one
export { originalTextStyleStore as textStyleStore };
```

### 2. Data Migration Rollback

When data structures have changed:

```tsx
// Step 1: Create a function to convert new data format to old format
const migrateNewToOld = (newData) => {
  // Convert new data to old format
  return oldFormattedData;
};

// Step 2: Apply migration when loading data
const loadData = async () => {
  const data = await storage.getData();
  
  // Check if data is in new format
  if (isNewFormat(data)) {
    // Convert to old format
    return migrateNewToOld(data);
  }
  
  return data;
};
```

## UI Rollback

For UI changes:

### 1. CSS Class Rollback

When CSS has been modified:

```tsx
// Step 1: Restore original CSS classes
const Button = ({ children, ...props }) => {
  return (
    <button
      // Revert to original classes
      className="original-button-class"
      {...props}
    >
      {children}
    </button>
  );
};
```

### 2. Component Prop Rollback

When component props have changed:

```tsx
// Step 1: Create an adapter component
const StyleEditorModalAdapter = (newProps) => {
  // Convert new props to format expected by original component
  const oldProps = {
    style: newProps.style,
    isOpen: newProps.isOpen,
    onClose: newProps.onClose,
    // Map new props to old format
  };
  
  // Render original component with converted props
  return <OriginalStyleEditorModal {...oldProps} />;
};
```

## API Integration Rollback

For API changes:

### 1. API Version Rollback

When API versions have changed:

```tsx
// Step 1: Revert to the previous API version
const apiClient = {
  baseUrl: 'https://api.example.com',
  
  // Use the previous API version
  version: 'v1', // Instead of 'v2'
  
  // Use methods compatible with the previous version
  getStyles: async () => {
    return fetch(`${apiClient.baseUrl}/${apiClient.version}/styles`);
  }
};
```

### 2. API Response Adapter

When API responses have changed:

```tsx
// Step 1: Create an adapter for API responses
const adaptNewResponseToOldFormat = (newResponse) => {
  // Convert new response format to old format
  return oldFormattedResponse;
};

// Step 2: Use the adapter when calling the API
const getStyles = async () => {
  const response = await fetch('/api/styles');
  const data = await response.json();
  
  // Adapt the response if it's in the new format
  if (isNewFormat(data)) {
    return adaptNewResponseToOldFormat(data);
  }
  
  return data;
};
```

## Database Rollback

For database schema changes:

### 1. Schema Version Rollback

When database schemas have changed:

```tsx
// Step 1: Use the original schema version
const dbConfig = {
  // Revert to the original schema version
  schemaVersion: 1, // Instead of 2
  
  // Use migrations compatible with the original schema
  migrations: [
    // Original migrations only
  ]
};
```

### 2. Data Backup Restoration

When data has been migrated:

```tsx
// Step 1: Restore from backup
const restoreFromBackup = async () => {
  // Load backup data
  const backup = await loadBackup();
  
  // Restore to the database
  await restoreDatabase(backup);
};
```

## Emergency Rollback Procedure

For urgent situations requiring immediate rollback:

1. **Activate Maintenance Mode** - If available, activate maintenance mode
2. **Restore Previous Version** - Deploy the last known good version
3. **Verify Critical Functionality** - Test core features quickly
4. **Notify Team** - Inform the team of the rollback
5. **Update Users** - Communicate with users if necessary

## Post-Rollback Actions

After rolling back changes:

1. **Document the Issue** - Record what went wrong and why rollback was needed
2. **Analyze Root Cause** - Determine the underlying cause of the issue
3. **Create Test Cases** - Add tests to prevent similar issues
4. **Plan Remediation** - Develop a plan to fix the issues
5. **Update Rollback Procedures** - Improve rollback procedures based on experience

## Rollback Example: Style Editor Modal

### Scenario

The new StyleEditorModal component has been implemented but is causing issues:

1. Style names aren't being validated
2. Saving sometimes creates duplicate styles
3. The modal doesn't close properly after saving

### Rollback Plan

1. **Identify Affected Components**:
   - StyleEditorModal
   - StyleForm
   - useStyleForm hook

2. **Prepare Rollback**:
   - Restore original components from backup or version control
   - Create adapter if necessary for API changes

3. **Execute Rollback**:

```tsx
// Step 1: Revert to original StyleEditorModal
import { OriginalStyleEditorModal } from './backup/OriginalStyleEditorModal';

// Step 2: Export the original component
export { OriginalStyleEditorModal as StyleEditorModal };

// Step 3: Revert hooks if necessary
import { originalUseStyleForm } from './backup/originalHooks';
export { originalUseStyleForm as useStyleForm };
```

4. **Verify Functionality**:
   - Test style creation
   - Test style editing
   - Test modal opening and closing

5. **Communicate Rollback**:
   - Inform the team of the rollback
   - Document issues found for future fixes

### Fixed Implementation Plan

After rollback, create a plan to fix the issues:

1. **Create a Test Environment**:
   - Set up isolated test environment
   - Import original components for reference

2. **Fix Issues Incrementally**:
   - Add name validation
   - Fix duplicate style detection
   - Fix modal closing behavior

3. **Comprehensive Testing**:
   - Test each fix individually
   - Test complete workflow
   - Verify no regressions

4. **Gradual Redeployment**:
   - Deploy to limited users first
   - Monitor for issues
   - Roll out to all users if stable
