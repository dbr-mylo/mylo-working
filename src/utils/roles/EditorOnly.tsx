
import React from 'react';
import { useIsWriter } from './RoleHooks';
import { RoleComponentProps } from './types';

/**
 * Component that only renders its children when the current user has the 'writer' role.
 * Can optionally show fallback content for other roles.
 * 
 * This includes both 'writer' and legacy 'editor' roles for backward compatibility.
 */
export const StandaloneWriterOnly: React.FC<RoleComponentProps> = ({ 
  children, 
  fallback = null 
}) => {
  const isWriter = useIsWriter();
  
  return isWriter ? <>{children}</> : <>{fallback}</>;
};

/**
 * @deprecated Use StandaloneWriterOnly instead
 */
export const StandaloneEditorOnly = StandaloneWriterOnly;
