
# Route Configuration System

This document describes the comprehensive route configuration system used throughout the application, including role-based permissions, route relationships, and metadata.

## Core Concepts

The route system is built around several key concepts:

1. **Route Configuration**: Each route has metadata describing its purpose, requirements, and relationships
2. **Role-Based Access**: Routes can be restricted to specific user roles
3. **Route Groups**: Routes are organized into logical groups for organization and navigation
4. **Route Relationships**: Routes can have parent/child relationships for navigation hierarchies
5. **Access Levels**: Routes are categorized by their authentication requirements

## Access Levels

- **Public**: Available to all users, including unauthenticated users
- **Protected**: Requires authentication but no specific role
- **Role-Specific**: Requires authentication with a specific role
- **Admin-Only**: Only available to administrators

## Role Permission Matrix

| Path | Admin | Designer | Writer | Editor | Unauthenticated |
|------|-------|----------|--------|--------|----------------|
| /    | ✅    | ✅       | ✅     | ✅     | ❌             |
| /auth | ✅    | ✅       | ✅     | ✅     | ✅             |
| /admin | ✅    | ❌       | ❌     | ❌     | ❌             |
| /design | ✅    | ✅       | ❌     | ❌     | ❌             |
| /content | ✅    | ❌       | ✅     | ✅     | ❌             |
| /writer-dashboard | ✅    | ❌       | ✅     | ✅     | ❌             |
| /designer-dashboard | ✅    | ✅       | ❌     | ❌     | ❌             |

## Route Groups

- **Dashboard**: Main dashboard views for different roles
- **Content**: Content creation and management
- **Design**: Design tools and templates
- **Admin**: Administrative functions
- **User**: User profile and settings
- **Testing**: Testing and debugging routes

## Default Routes By Role

- **Admin**: `/admin`
- **Designer**: `/designer-dashboard`
- **Writer**: `/writer-dashboard`
- **Editor**: `/writer-dashboard`
- **Unauthenticated**: `/auth`

## Fallback Routes By Role

If a user attempts to access a route they don't have permission for, they'll be redirected to their fallback route:

- **Admin**: `/admin`
- **Designer**: `/designer-dashboard`
- **Writer**: `/writer-dashboard`
- **Editor**: `/writer-dashboard`
- **Unauthenticated**: `/auth`

## Route Relationships

Routes can have the following relationships:

- **Parent**: A higher-level route that this route belongs to
- **Child**: Lower-level routes that belong to this route
- **Sibling**: Routes that share the same parent
- **Alternative**: Similar routes for different roles/purposes

These relationships are used for breadcrumb navigation, sidebar menus, and contextual navigation.

## Route Analytics

Routes can be configured for different levels of analytics tracking:

- **Basic**: Standard page views
- **Advanced**: Detailed metrics including duration, interactions, and custom events

## Implementation Details

Route configurations are defined in `src/utils/navigation/config/routeDefinitions.ts` and use types from `src/utils/navigation/types.ts`.

Helper functions for working with routes are available in `src/utils/navigation/config/routeUtils.ts` and `src/utils/navigation/config/routeRelationships.ts`.

## Extending the System

When adding new routes:

1. Add the route configuration to `validRoutes` in `routeDefinitions.ts`
2. Ensure proper role permissions are set
3. Add appropriate group and relationship metadata
4. Update relevant route maps if needed (DEFAULT_ROUTES, FALLBACK_ROUTES)

