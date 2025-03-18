
import { useAuth } from "@/contexts/AuthContext";
import { roleAuditLogger } from "@/utils/roles/auditLogger";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useState } from "react";
import { toast } from "sonner";

/**
 * Hook for strengthened admin role verification
 * Provides additional security checks for admin actions
 */
export const useAdminVerification = () => {
  const { user, role } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);

  /**
   * Verify admin role with database check
   * Provides additional verification beyond just checking local state
   */
  const verifyAdminRole = useCallback(async (): Promise<boolean> => {
    // Not logged in or not admin in local state
    if (!user || role !== 'admin') {
      roleAuditLogger.logRoleChange({
        userId: user?.id || null,
        previousRole: role,
        newRole: role,
        timestamp: Date.now(),
        source: 'system',
        success: false,
        error: 'Admin verification failed - Not admin in local state'
      });
      return false;
    }

    try {
      setIsVerifying(true);
      
      // Double check with database that user still has admin role
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      if (error || !data || data.role !== 'admin') {
        roleAuditLogger.logRoleChange({
          userId: user?.id || null,
          previousRole: role,
          newRole: data?.role || null,
          timestamp: Date.now(),
          source: 'system',
          success: false,
          error: error?.message || 'Admin verification failed - Database check'
        });
        
        toast.error('Your admin session could not be verified');
        return false;
      }
      
      // Admin verification successful
      roleAuditLogger.logRoleChange({
        userId: user?.id,
        previousRole: role,
        newRole: 'admin',
        timestamp: Date.now(),
        source: 'system',
        success: true
      });
      
      return true;
    } catch (error) {
      console.error('Admin verification error:', error);
      toast.error('An error occurred while verifying admin status');
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [user, role]);

  /**
   * Execute a function only if admin verification passes
   * @param fn Function to execute if verification passes
   * @param onFailure Optional callback for failure case
   */
  const withAdminVerification = useCallback(async <T,>(
    fn: () => Promise<T>, 
    onFailure?: () => void
  ): Promise<T | undefined> => {
    const isVerified = await verifyAdminRole();
    
    if (isVerified) {
      return await fn();
    } else {
      if (onFailure) {
        onFailure();
      }
      return undefined;
    }
  }, [verifyAdminRole]);

  return {
    isAdmin: role === 'admin',
    isVerifying,
    verifyAdminRole,
    withAdminVerification
  };
};
