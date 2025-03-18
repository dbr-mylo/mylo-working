
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

// Type guard for UserRole
export function isValidRole(role: any): role is UserRole {
  return typeof role === 'string' && VALID_ROLES.includes(role as UserRole);
}

/**
 * Store user role in localStorage with timestamp
 * @param role The user role to persist
 * @throws {RoleError} If the role is invalid
 * @throws {StorageError} If there's an error storing the role
 */
export const persistRole = (role: UserRole | null): void => {
  try {
    // Validate role before storing
    if (role !== null && !isValidRole(role)) {
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
    
    const guestRoleState = parseGuestRoleState(storedRoleData);
    
    // Return null if parsing failed
    if (!guestRoleState) {
      return null;
    }
    
    // Check if the role has expired
    if (isRoleExpired(guestRoleState)) {
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
 * Safely parse guest role state with type validation
 * @param jsonString The JSON string to parse
 * @returns Parsed and validated GuestRoleState or null if invalid
 */
export const parseGuestRoleState = (jsonString: string): GuestRoleState | null => {
  try {
    const parsed = JSON.parse(jsonString);
    
    // Type validation
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }
    
    // Required fields validation
    if (!isValidRole(parsed.role) || 
        typeof parsed.timestamp !== 'number' || 
        typeof parsed.expiresAt !== 'number') {
      return null;
    }
    
    return parsed as GuestRoleState;
  } catch {
    return null;
  }
};

/**
 * Check if a GuestRoleState has expired
 * @param roleState The guest role state to check
 * @returns Whether the role has expired
 */
export const isRoleExpired = (roleState: GuestRoleState): boolean => {
  return Date.now() > roleState.expiresAt;
};

/**
 * Validate a role string to ensure it's a valid UserRole
 * @param role The role to validate
 * @returns The validated role or null if invalid
 */
export const validateRole = (role: any): UserRole | null => {
  if (isValidRole(role)) {
    return role;
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

/**
 * Format role expiration time in a human-readable format
 * @param expiresAt Expiration timestamp
 * @returns Human-readable string (e.g., "23 hours 59 minutes")
 */
export const formatRoleExpirationTime = (expiresAt: number): string => {
  const remainingMs = getRoleRemainingTime(expiresAt);
  
  if (remainingMs <= 0) {
    return 'Expired';
  }
  
  const seconds = Math.floor(remainingMs / 1000) % 60;
  const minutes = Math.floor(remainingMs / (1000 * 60)) % 60;
  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  
  if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  }
  
  if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
  }
  
  return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
};
