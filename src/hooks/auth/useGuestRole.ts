
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
  ROLE_STORAGE_KEY 
} from "@/utils/roles/persistence";
import { roleAuditLogger } from "@/utils/roles/auditLogger";

/**
 * Hook for managing guest role functionality
 */
export const useGuestRole = () => {
  // Load guest role on initialization
  const loadGuestRole = (): UserRole | null => {
    try {
      const role = retrievePersistedRole();
      
      if (role) {
        // Log successful role load
        roleAuditLogger.logRoleChange({
          userId: null,
          previousRole: null,
          newRole: role,
          timestamp: Date.now(),
          source: 'guest',
          success: true
        });
      }
      
      return role;
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
  const saveGuestRole = (role: UserRole): void => {
    try {
      // Validate role before saving
      if (!VALID_ROLES.includes(role)) {
        throw new RoleError(`Invalid role: ${role}`);
      }
      
      persistRole(role);
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
    }
  };

  // Set guest role (used by the context)
  const setGuestRole = (role: UserRole) => {
    try {
      // Validate role
      if (!VALID_ROLES.includes(role)) {
        throw new RoleError(`Invalid role: ${role}`);
      }
      
      // Save role to local storage for persistence
      saveGuestRole(role);
      
      // Log successful role change
      roleAuditLogger.logRoleChange({
        userId: null,
        previousRole: null,
        newRole: role,
        timestamp: Date.now(),
        source: 'guest',
        success: true
      });
      
      toast.success(`Continuing as ${role.charAt(0).toUpperCase() + role.slice(1)}`);
      return role;
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
  const clearGuestRole = () => {
    try {
      const currentRole = retrievePersistedRole();
      
      // Remove role from local storage
      localStorage.removeItem(ROLE_STORAGE_KEY);
      
      // Log role removal
      roleAuditLogger.logRoleChange({
        userId: null,
        previousRole: currentRole,
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

  // Helper functions for specific roles
  const continueAsGuestEditor = () => setGuestRole("editor");
  const continueAsGuestDesigner = () => setGuestRole("designer");

  return {
    loadGuestRole,
    saveGuestRole,
    setGuestRole,
    clearGuestRole,
    continueAsGuestEditor,
    continueAsGuestDesigner
  };
};
