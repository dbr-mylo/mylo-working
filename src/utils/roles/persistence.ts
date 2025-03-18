
import { UserRole } from "@/lib/types";
import { GuestRoleState } from "@/lib/types/authTypes";
import { RoleError, StorageError } from "@/lib/errors/authErrors";

// Constants for storage keys
export const ROLE_STORAGE_KEY = 'app_user_role';
export const ROLE_TIMESTAMP_KEY = 'app_role_timestamp';

// Role expiration time in milliseconds (24 hours)
export const ROLE_EXPIRATION_TIME = 24 * 60 * 60 * 1000;

// Valid user roles
export const VALID_ROLES: UserRole[] = ['editor', 'designer', 'admin'];

/**
 * Store user role in localStorage with timestamp
 * @param role The user role to persist
 * @throws {RoleError} If the role is invalid
 * @throws {StorageError} If there's an error storing the role
 */
export const persistRole = (role: UserRole | null): void => {
  try {
    // Validate role before storing
    if (role !== null && !VALID_ROLES.includes(role)) {
      throw new RoleError(`Invalid role: ${role}`);
    }
    
    if (role) {
      const expiresAt = Date.now() + ROLE_EXPIRATION_TIME;
      const guestRoleState: GuestRoleState = {
        role,
        timestamp: Date.now(),
        expiresAt
      };
      
      localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(guestRoleState));
    } else {
      localStorage.removeItem(ROLE_STORAGE_KEY);
    }
  } catch (error) {
    if (error instanceof RoleError) {
      throw error;
    }
    
    throw new StorageError('Error persisting role', {
      originalError: error,
      context: 'Failed to save role to localStorage'
    });
  }
};

/**
 * Retrieve user role from localStorage if not expired
 * @returns The stored role or null if no valid role exists
 * @throws {StorageError} If there's an error retrieving the role
 */
export const retrievePersistedRole = (): UserRole | null => {
  try {
    const storedRoleData = localStorage.getItem(ROLE_STORAGE_KEY);
    
    if (!storedRoleData) {
      return null;
    }
    
    const guestRoleState: GuestRoleState = JSON.parse(storedRoleData);
    
    // Validate the parsed data
    if (!guestRoleState || !guestRoleState.role || !guestRoleState.timestamp) {
      // Invalid data format, clear it
      localStorage.removeItem(ROLE_STORAGE_KEY);
      return null;
    }
    
    // Check if the role is valid
    if (!VALID_ROLES.includes(guestRoleState.role)) {
      localStorage.removeItem(ROLE_STORAGE_KEY);
      return null;
    }
    
    // Check if the role has expired
    const isExpired = Date.now() > guestRoleState.expiresAt || 
                      Date.now() - guestRoleState.timestamp > ROLE_EXPIRATION_TIME;
    
    if (isExpired) {
      // Clear expired role
      localStorage.removeItem(ROLE_STORAGE_KEY);
      return null;
    }
    
    return guestRoleState.role;
  } catch (error) {
    console.error('Error retrieving persisted role:', error);
    
    // Try to clean up potentially corrupted data
    try {
      localStorage.removeItem(ROLE_STORAGE_KEY);
    } catch {}
    
    throw new StorageError('Error retrieving role from storage', {
      originalError: error
    });
  }
};

/**
 * Validate a role string to ensure it's a valid UserRole
 * @param role The role to validate
 * @returns The validated role or null if invalid
 */
export const validateRole = (role: any): UserRole | null => {
  if (role && typeof role === 'string' && VALID_ROLES.includes(role as UserRole)) {
    return role as UserRole;
  }
  
  return null;
};

/**
 * Check if a role has expired
 * @param timestamp The timestamp when the role was set
 * @returns Whether the role has expired
 */
export const hasRoleExpired = (timestamp: number): boolean => {
  return Date.now() - timestamp > ROLE_EXPIRATION_TIME;
};

/**
 * Get the remaining time for a role in milliseconds
 * @param expiresAt The expiration timestamp
 * @returns Remaining time in milliseconds, or 0 if expired
 */
export const getRoleRemainingTime = (expiresAt: number): number => {
  const remaining = expiresAt - Date.now();
  return remaining > 0 ? remaining : 0;
};
