
/**
 * Editor-Only Component
 * 
 * This component only renders its children when the current user has the editor role.
 * It's extracted into its own file to prevent circular dependencies.
 */

import React from 'react';
import { useIsEditor } from './RoleHooks';
import { RoleComponentProps } from './types';

/**
 * Renders content only if the current user has the editor role
 */
export const EditorOnly: React.FC<RoleComponentProps> = ({ 
  children, 
  fallback = null 
}) => {
  const isEditor = useIsEditor();
  
  if (isEditor) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};
