
import { useTestGuestRole } from "./useTestGuestRole";
import { useState, useEffect } from "react";
import { UserRole } from "@/lib/types";

/**
 * Test implementation to verify the improved guest role functionality
 * Follows change management process by creating a test component before modifying original
 */
export const useTestGuestRoleImplementation = () => {
  const {
    guestRole,
    expiresAt,
    loadGuestRole,
    setGuestRole,
    clearGuestRole,
    getRoleExpirationInfo
  } = useTestGuestRole();
  
  const [role, setRole] = useState<UserRole | null>(guestRole);
  const [expirationInfo, setExpirationInfo] = useState(getRoleExpirationInfo());
  
  // Update expiration info periodically
  useEffect(() => {
    if (!expiresAt) return;
    
    const updateExpiration = () => {
      setExpirationInfo(getRoleExpirationInfo());
    };
    
    // Update every minute
    const interval = setInterval(updateExpiration, 60 * 1000);
    
    // Initial update
    updateExpiration();
    
    return () => clearInterval(interval);
  }, [expiresAt, getRoleExpirationInfo]);
  
  // Handle role changes
  const handleSetRole = (newRole: UserRole) => {
    const result = setGuestRole(newRole);
    if (result) {
      setRole(result);
      setExpirationInfo(getRoleExpirationInfo());
    }
    return result;
  };
  
  // Handle role clearing
  const handleClearRole = () => {
    const result = clearGuestRole();
    if (result) {
      setRole(null);
      setExpirationInfo(null);
    }
    return result;
  };
  
  return {
    role,
    expirationInfo,
    setRole: handleSetRole,
    clearRole: handleClearRole
  };
};
