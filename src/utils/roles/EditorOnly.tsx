
import React from 'react';
import { useIsWriter } from './RoleHooks';
import { RoleComponentProps } from './types';

/**
 * Component that only renders its children when the current user has the 'writer' role.
 * Can optionally show fallback content for other roles.
 * 
 * This includes both 'writer' and legacy 'editor' roles for backward compatibility.
 * 
 * @example
 * ```tsx
 * <StandaloneWriterOnly fallback={<p>You need writer access to view this.</p>}>
 *   <WriterContent />
 * </StandaloneWriterOnly>
 * ```
 */
export const StandaloneWriterOnly: React.FC<RoleComponentProps> = ({ 
  children, 
  fallback = null 
}) => {
  const isWriter = useIsWriter();
  
  if (!isWriter) {
    console.log("Content hidden: User does not have writer role");
  }
  
  return isWriter ? <>{children}</> : <>{fallback}</>;
};

/**
 * @deprecated Use StandaloneWriterOnly instead
 */
export const StandaloneEditorOnly = StandaloneWriterOnly;
