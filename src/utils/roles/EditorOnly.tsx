
import React from 'react';
import { useIsEditor } from './RoleHooks';
import { RoleComponentProps } from './types';

/**
 * Component that only renders its children when the current user has the 'editor' role.
 * Can optionally show fallback content for other roles.
 */
export const StandaloneEditorOnly: React.FC<RoleComponentProps> = ({ 
  children, 
  fallback = null 
}) => {
  const isEditor = useIsEditor();
  
  return isEditor ? <>{children}</> : <>{fallback}</>;
};

