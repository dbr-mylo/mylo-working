
# Role-Based Architecture

**Last Updated:** 2023-11-20

## Overview

This document explains the role-based architecture of the application, which adapts both functionality and UI based on user roles. This architecture ensures that users have access to the appropriate tools and capabilities based on their responsibilities.

## Core Roles

The application recognizes two primary user roles:

1. **Designer** - Creates and manages design systems, templates, and styles
2. **Editor** - Creates and edits content using the design system

## Role-Based Rendering

Components adapt their rendering based on user roles through the role-based rendering system:

```tsx
import { DesignerOnly, EditorOnly } from '@/utils/roles';

const DocumentToolbar = () => {
  return (
    <div className="document-toolbar">
      {/* Common tools available to all roles */}
      <ViewControls />
      
      {/* Editor-specific tools */}
      <EditorOnly>
        <ContentControls />
      </EditorOnly>
      
      {/* Designer-specific tools */}
      <DesignerOnly>
        <StyleControls />
        <TemplateControls />
      </DesignerOnly>
    </div>
  );
};
```

## Role-Based Functionality

Beyond UI rendering, the application implements role-based functionality:

```tsx
import { useRolePermissions } from '@/utils/roles';

const DocumentActions = () => {
  const { canEditContent, canManageStyles, canPublish } = useRolePermissions();
  
  const handleSave = () => {
    if (canEditContent) {
      saveDocument();
    }
  };
  
  const handleStyleEdit = () => {
    if (canManageStyles) {
      openStyleEditor();
    }
  };
  
  return (
    <div className="document-actions">
      <button 
        onClick={handleSave}
        disabled={!canEditContent}
      >
        Save
      </button>
      
      <button 
        onClick={handleStyleEdit}
        disabled={!canManageStyles}
      >
        Edit Styles
      </button>
      
      <button 
        onClick={handlePublish}
        disabled={!canPublish}
      >
        Publish
      </button>
    </div>
  );
};
```

## Role Capability Matrix

| Capability | Designer | Editor |
|------------|----------|--------|
| View Content | ✅ | ✅ |
| Edit Content | ✅ | ✅ |
| Create Content | ✅ | ✅ |
| Delete Content | ✅ | ✅ |
| Create Styles | ✅ | ❌ |
| Edit Styles | ✅ | ❌ |
| Apply Styles | ✅ | ✅ |
| Create Templates | ✅ | ❌ |
| Apply Templates | ✅ | ✅ |
| System Settings | ✅ | ❌ |

## Role-Based Components

The application organizes components by role in the directory structure:

```
src/
  components/
    common/      # Components used by all roles
    designer/    # Designer-specific components
    editor/      # Editor-specific components
```

### Designer Components

Components specific to the designer role:

- `StyleEditor` - For creating and editing text styles
- `TemplateManager` - For creating and managing templates
- `DesignerSidebar` - Designer-specific sidebar with design tools
- `StyleInheritance` - For managing style inheritance relationships

### Editor Components

Components specific to the editor role:

- `ContentEditor` - For editing document content
- `StyleApplicator` - For applying styles to content
- `EditorToolbar` - Editor-specific toolbar with formatting tools
- `TemplateSelector` - For selecting and applying templates

### Common Components

Components shared across roles:

- `DocumentList` - For browsing available documents
- `DocumentViewer` - For viewing document content
- `UserProfile` - For managing user profile information
- `Navigation` - For navigating the application

## Role-Based Routing

The application uses role-based routing to restrict access to certain routes:

```tsx
import { Route, ProtectedRoute } from '@/router';
import { ROLES } from '@/utils/roles';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes for all authenticated users */}
      <ProtectedRoute path="/documents" element={<DocumentList />} />
      <ProtectedRoute path="/documents/:id" element={<DocumentView />} />
      
      {/* Designer-only routes */}
      <ProtectedRoute 
        path="/design-system" 
        element={<DesignSystem />} 
        requiredRoles={[ROLES.DESIGNER]}
      />
    </Routes>
  );
};
```

## Role-Based State Management

State management adapts based on user roles:

```tsx
import { useRole } from '@/utils/roles';

const useDocumentState = (documentId) => {
  const role = useRole();
  
  // Load different state based on role
  if (role === ROLES.DESIGNER) {
    return useDesignerDocumentState(documentId);
  } else if (role === ROLES.EDITOR) {
    return useEditorDocumentState(documentId);
  }
  
  // Fallback to basic document state
  return useBasicDocumentState(documentId);
};
```

## Role Implementation

The role system is implemented using:

1. **User Context** - Contains the current user's role information
2. **Role Components** - Components for conditional rendering
3. **Role Hooks** - Hooks for role-based functionality
4. **Role Guards** - Guards for protecting routes and actions

### User Context

```tsx
const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Load the user and their role
  useEffect(() => {
    const loadUser = async () => {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    };
    
    loadUser();
  }, []);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
};
```

### Role Components

```tsx
export const DesignerOnly: React.FC = ({ children }) => {
  const { user } = useUser();
  
  if (!user || !hasRole(user, ROLES.DESIGNER)) {
    return null;
  }
  
  return <>{children}</>;
};

export const EditorOnly: React.FC = ({ children }) => {
  const { user } = useUser();
  
  if (!user || !hasRole(user, ROLES.EDITOR)) {
    return null;
  }
  
  return <>{children}</>;
};
```

### Role Hooks

```tsx
export const useRole = () => {
  const { user } = useUser();
  
  if (!user) {
    return null;
  }
  
  return user.role;
};

export const useRolePermissions = () => {
  const role = useRole();
  
  // Define permissions based on role
  const permissions = {
    canEditContent: [ROLES.DESIGNER, ROLES.EDITOR].includes(role),
    canManageStyles: [ROLES.DESIGNER].includes(role),
    canManageTemplates: [ROLES.DESIGNER].includes(role),
    canPublish: [ROLES.DESIGNER, ROLES.EDITOR].includes(role),
    canManageSystem: [ROLES.DESIGNER].includes(role),
  };
  
  return permissions;
};
```

## Role-Based Workflows

Different roles have different workflows within the application:

### Designer Workflow

1. **Create Design System** - Define text styles and templates
2. **Define Style Inheritance** - Create style relationships
3. **Create Templates** - Design document templates
4. **Create Content** - Create example content
5. **Publish Design System** - Make styles and templates available

### Editor Workflow

1. **Select Document Type** - Choose document type or template
2. **Create Content** - Add content to the document
3. **Apply Styles** - Apply styles from the design system
4. **Edit and Refine** - Refine the document content
5. **Publish** - Publish the document

## Best Practices

1. **Clear Role Separation** - Keep clear boundaries between role-specific functionality
2. **Default to Most Common Role** - Design for the most common role first
3. **Reuse Components** - Share components across roles when possible
4. **Progressive Enhancement** - Add role-specific features progressively
5. **Role Testing** - Test functionality with each role

## Technical Implementation

The role system is implemented using several key patterns:

### Role Identification

```tsx
// Determine the user's role
const getUserRole = (user) => {
  if (!user) return null;
  
  if (user.roles.includes('designer')) {
    return ROLES.DESIGNER;
  } else if (user.roles.includes('editor')) {
    return ROLES.EDITOR;
  }
  
  return ROLES.VIEWER;
};
```

### Role-Based Component Selection

```tsx
// Select component based on role
const RoleBasedEditor = () => {
  const role = useRole();
  
  switch(role) {
    case ROLES.DESIGNER:
      return <DesignerEditor />;
    case ROLES.EDITOR:
      return <ContentEditor />;
    default:
      return <ViewOnlyEditor />;
  }
};
```

### Permission-Based Actions

```tsx
// Check permissions before performing actions
const DocumentActions = () => {
  const permissions = useRolePermissions();
  
  const handleDelete = () => {
    if (permissions.canDeleteDocuments) {
      deleteDocument();
    } else {
      showPermissionError();
    }
  };
  
  return (
    <button 
      onClick={handleDelete}
      disabled={!permissions.canDeleteDocuments}
    >
      Delete
    </button>
  );
};
```
