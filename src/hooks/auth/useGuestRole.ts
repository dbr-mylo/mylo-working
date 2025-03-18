
import { useState } from "react";
import { UserRole } from "@/lib/types";
import { GuestRoleState } from "@/lib/types/authTypes";
import { 
  RoleError, 
  StorageError 
} from "@/lib/errors/authErrors";
import { toast } from "sonner";
import { 
  persistRole, 
  retrievePersistedRole, 
  VALID_ROLES 
} from "@/utils/roles/persistence";

/**
 * Hook for managing guest role functionality
 */
export const useGuestRole = () => {
  // Load guest role on initialization
  const loadGuestRole = (): UserRole | null => {
    try {
      return retrievePersistedRole();
    } catch (error) {
      const storageError = new StorageError('Error loading guest role from localStorage', {
        originalError: error
      });
      console.warn(storageError.message, error);
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

  // Helper functions for specific roles
  const continueAsGuestEditor = () => setGuestRole("editor");
  const continueAsGuestDesigner = () => setGuestRole("designer");
  const continueAsGuestAdmin = () => setGuestRole("admin");

  return {
    loadGuestRole,
    saveGuestRole,
    setGuestRole,
    continueAsGuestEditor,
    continueAsGuestDesigner,
    continueAsGuestAdmin
  };
};
