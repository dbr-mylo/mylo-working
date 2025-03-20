
import React from 'react';
import { useIsDesigner } from './RoleHooks';
import { RoleComponentProps } from './types';

/**
 * Component that only renders its children when the current user has the 'designer' role.
 * Can optionally show fallback content for other roles.
 */
export const DesignerOnly: React.FC<RoleComponentProps> = ({ 
  children, 
  fallback = null 
}) => {
  const isDesigner = useIsDesigner();
  
  return isDesigner ? <>{children}</> : <>{fallback}</>;
};

/**
 * Legacy name for AdminOnly component to maintain backward compatibility
 * @deprecated Use DesignerOnly instead
 */
export const AdminOnly = DesignerOnly;

/**
 * Standalone version of DesignerOnly for use outside of role context
 */
export const StandaloneDesignerOnly = DesignerOnly;

/**
 * Legacy name for StandaloneAdminOnly component to maintain backward compatibility
 * @deprecated Use StandaloneDesignerOnly instead
 */
export const StandaloneAdminOnly = StandaloneDesignerOnly;
