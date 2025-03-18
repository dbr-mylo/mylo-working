
import { UserRole } from "@/lib/types";

// Constants for storage keys
export const ROLE_STORAGE_KEY = 'app_user_role';
export const ROLE_TIMESTAMP_KEY = 'app_role_timestamp';

// Role expiration time in milliseconds (24 hours)
export const ROLE_EXPIRATION_TIME = 24 * 60 * 60 * 1000;

/**
 * Store user role in localStorage with timestamp
 */
export const persistRole = (role: UserRole | null): void => {
  try {
    if (role) {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
      localStorage.setItem(ROLE_TIMESTAMP_KEY, Date.now().toString());
    } else {
      localStorage.removeItem(ROLE_STORAGE_KEY);
      localStorage.removeItem(ROLE_TIMESTAMP_KEY);
    }
  } catch (error) {
    console.error('Error persisting role:', error);
  }
};

/**
 * Retrieve user role from localStorage if not expired
 */
export const retrievePersistedRole = (): UserRole | null => {
  try {
    const storedRole = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole | null;
    const timestamp = localStorage.getItem(ROLE_TIMESTAMP_KEY);
    
    if (storedRole && timestamp) {
      // Check if the role has expired
      const isExpired = Date.now() - parseInt(timestamp) > ROLE_EXPIRATION_TIME;
      
      if (!isExpired) {
        return storedRole;
      } else {
        // Clear expired role
        localStorage.removeItem(ROLE_STORAGE_KEY);
        localStorage.removeItem(ROLE_TIMESTAMP_KEY);
      }
    }
  } catch (error) {
    console.error('Error retrieving persisted role:', error);
  }
  
  return null;
};

/**
 * Validate a role string to ensure it's a valid UserRole
 */
export const validateRole = (role: any): UserRole | null => {
  const validRoles: UserRole[] = ['editor', 'designer', 'admin'];
  
  if (role && typeof role === 'string' && validRoles.includes(role as UserRole)) {
    return role as UserRole;
  }
  
  return null;
};
