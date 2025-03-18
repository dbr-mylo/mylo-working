
import { useState } from "react";
import { UserRole } from "@/lib/types";
import { GuestRoleState } from "@/lib/types/authTypes";
import { 
  RoleError, 
  StorageError 
} from "@/lib/errors/auth";
import { toast } from "sonner";
import { 
  persistRole, 
  retrievePersistedRole, 
  VALID_ROLES,
  ROLE_STORAGE_KEY,
  getRoleRemainingTime,
  formatRoleExpirationTime
} from "@/utils/roles/persistence";
import { roleAuditLogger } from "@/utils/roles/auditLogger";

/**
 * Test version of the useGuestRole hook with improved persistence
 * This follows the change management process by creating a test implementation 
 * before modifying the original
 */
export const useTestGuestRole = () => {
  // State to track role and its expiration
  const [guestRoleInfo, setGuestRoleInfo] = useState<{
    role: UserRole | null,
    expiresAt: number | null
  }>(() => {
    const roleData = loadGuestRole();
    return {
      role: roleData?.role || null,
      expiresAt: roleData?.expiresAt || null
    };
  });

  // Load guest role on initialization with enhanced error handling and auditing
  const loadGuestRole = (): GuestRoleState | null => {
    try {
      const roleState = retrievePersistedRole();
      
      if (roleState) {
        // Log successful role load
        roleAuditLogger.logRoleChange({
          userId: null,
          previousRole: null,
          newRole: roleState.role,
          timestamp: Date.now(),
          source: 'guest',
          success: true,
          metadata: {
            expiresAt: roleState.expiresAt,
            remainingTime: getRoleRemainingTime(roleState.expiresAt)
          }
        });
        
        return roleState;
      }
      
      return null;
    } catch (error) {
      const storageError = new StorageError('Error loading guest role from localStorage', {
        originalError: error
      });
      console.warn(storageError.message, error);
      
      // Log failed role load
      roleAuditLogger.logRoleChange({
        userId: null,
        previousRole: null,
        newRole: null,
        timestamp: Date.now(),
        source: 'guest',
        success: false,
        error: storageError.message
      });
      
      return null;
    }
  };

  // Save guest role to local storage with better error handling
  const saveGuestRole = (role: UserRole): GuestRoleState | null => {
    try {
      // Validate role before saving
      if (!VALID_ROLES.includes(role)) {
        throw new RoleError(`Invalid role: ${role}`);
      }
      
      persistRole(role);
      
      // Retrieve the persisted role state to get the expiration time
      const roleState = retrievePersistedRole();
      
      if (roleState) {
        setGuestRoleInfo({
          role: roleState.role,
          expiresAt: roleState.expiresAt
        });
      }
      
      return roleState;
    } catch (error) {
      const storageError = error instanceof RoleError
        ? error
        : new StorageError('Failed to save guest role', { originalError: error });
      console.warn(storageError.message, error);
      
      // Log failed role save
      roleAuditLogger.logRoleChange({
        userId: null,
        previousRole: null,
        newRole: role,
        timestamp: Date.now(),
        source: 'guest',
        success: false,
        error: storageError.message
      });
      
      toast.error('Failed to save your guest session. Your role will be lost when you close the browser.');
      return null;
    }
  };

  // Set guest role (used by the context)
  const setGuestRole = (role: UserRole): UserRole | null => {
    try {
      // Validate role
      if (!VALID_ROLES.includes(role)) {
        throw new RoleError(`Invalid role: ${role}`);
      }
      
      // Save role to local storage for persistence
      const roleState = saveGuestRole(role);
      
      if (roleState) {
        // Format expiration time for user-friendly message
        const expirationText = formatRoleExpirationTime(roleState.expiresAt);
        
        // Log successful role change with expiration info
        roleAuditLogger.logRoleChange({
          userId: null,
          previousRole: null,
          newRole: role,
          timestamp: Date.now(),
          source: 'guest',
          success: true,
          metadata: {
            expiresAt: roleState.expiresAt,
            expirationText
          }
        });
        
        toast.success(`Continuing as ${role.charAt(0).toUpperCase() + role.slice(1)} for ${expirationText}`);
        return role;
      }
      
      return null;
    } catch (error) {
      const roleError = error instanceof RoleError
        ? error
        : new RoleError('Failed to set guest role', {
            originalError: error
          });
      
      toast.error(roleError.getUserMessage());
      throw roleError;
    }
  };

  // Clear guest role from local storage
  const clearGuestRole = (): boolean => {
    try {
      const currentRoleState = retrievePersistedRole();
      
      // Remove role from local storage
      localStorage.removeItem(ROLE_STORAGE_KEY);
      
      // Update state
      setGuestRoleInfo({
        role: null,
        expiresAt: null
      });
      
      // Log role removal
      roleAuditLogger.logRoleChange({
        userId: null,
        previousRole: currentRoleState?.role || null,
        newRole: null,
        timestamp: Date.now(),
        source: 'guest',
        success: true
      });
      
      toast.success("Signed out successfully");
      return true;
    } catch (error) {
      console.error("Error clearing guest role:", error);
      toast.error("Failed to sign out. Please try again.");
      return false;
    }
  };
  
  // Get role expiration info
  const getRoleExpirationInfo = () => {
    if (guestRoleInfo.expiresAt) {
      return {
        expiresAt: guestRoleInfo.expiresAt,
        remainingTime: getRoleRemainingTime(guestRoleInfo.expiresAt),
        formattedTime: formatRoleExpirationTime(guestRoleInfo.expiresAt),
        isExpired: Date.now() > guestRoleInfo.expiresAt
      };
    }
    return null;
  };

  // Helper functions for specific roles
  const continueAsGuestEditor = () => setGuestRole("editor");
  const continueAsGuestDesigner = () => setGuestRole("designer");
  const continueAsGuestAdmin = () => setGuestRole("admin");

  return {
    guestRole: guestRoleInfo.role,
    expiresAt: guestRoleInfo.expiresAt,
    loadGuestRole,
    saveGuestRole,
    setGuestRole,
    clearGuestRole,
    continueAsGuestEditor,
    continueAsGuestDesigner,
    continueAsGuestAdmin,
    getRoleExpirationInfo
  };
};
