
/**
 * Standalone Legacy Components
 * 
 * These are standalone versions of the deprecated components for use
 * outside of the normal import path. This maintains backward compatibility
 * with older code that imports these components directly.
 */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isWriterRole, isAdminRole } from './RoleFunctions';

export const StandaloneEditorOnly: React.FC<{ 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => {
  console.warn('StandaloneEditorOnly is deprecated, use WriterOnly from utils/roles instead');
  const { role } = useAuth();
  const allowed = isWriterRole(role) || isAdminRole(role);
  
  return allowed ? <>{children}</> : <>{fallback}</>;
};

export const StandaloneWriterOnly = StandaloneEditorOnly;
