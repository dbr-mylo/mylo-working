
/**
 * EditorOnly Component
 * 
 * This component is specifically for rendering content only to users with the editor role.
 * It's a specialized version of the RoleOnly component.
 */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RoleComponentProps } from './types';

/**
 * Component that only renders its children for the editor role
 */
export const EditorOnly: React.FC<RoleComponentProps> = ({ 
  children, 
  fallback = null 
}) => {
  const { role } = useAuth();
  
  if (role === 'editor') {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};
