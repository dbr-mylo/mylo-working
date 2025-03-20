import { useAuth } from "@/contexts/AuthContext";
import { roleAuditLogger } from "@/utils/roles/auditLogger";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useState } from "react";
import { toast } from "sonner";

/**
 * Hook for strengthened designer role verification
 * Provides additional security checks for designer actions
 * (Previously named useAdminVerification, renamed for clarity)
 */
export const useDesignerVerification = () => {
  const { user, role } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);

  /**
   * Verify designer role with database check
   * Provides additional verification beyond just checking local state
   */
  const verifyDesignerRole = useCallback(async (): Promise<boolean> => {
    // Not logged in or not designer in local state
    if (!user || role !== 'designer') {
      roleAuditLogger.logRoleChange({
        userId: user?.id || null,
        previousRole: role,
        newRole: role,
        timestamp: Date.now(),
        source: 'system',
        success: false,
        error: 'Designer verification failed - Not designer in local state'
      });
      return false;
    }

    try {
      setIsVerifying(true);
      
      // Double check with database that user still has designer role
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      if (error || !data || data.role !== 'designer') {
        roleAuditLogger.logRoleChange({
          userId: user?.id || null,
          previousRole: role,
          newRole: data?.role || null,
          timestamp: Date.now(),
          source: 'system',
          success: false,
          error: error?.message || 'Designer verification failed - Database check'
        });
        
        toast.error('Your designer session could not be verified');
        return false;
      }
      
      // Designer verification successful
      roleAuditLogger.logRoleChange({
        userId: user?.id,
        previousRole: role,
        newRole: 'designer',
        timestamp: Date.now(),
        source: 'system',
        success: true
      });
      
      return true;
    } catch (error) {
      console.error('Designer verification error:', error);
      toast.error('An error occurred while verifying designer status');
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [user, role]);

  /**
   * Execute a function only if designer verification passes
   * @param fn Function to execute if verification passes
   * @param onFailure Optional callback for failure case
   */
  const withDesignerVerification = useCallback(async <T,>(
    fn: () => Promise<T>, 
    onFailure?: () => void
  ): Promise<T | undefined> => {
    const isVerified = await verifyDesignerRole();
    
    if (isVerified) {
      return await fn();
    } else {
      if (onFailure) {
        onFailure();
      }
      return undefined;
    }
  }, [verifyDesignerRole]);

  return {
    isDesigner: role === 'designer',
    isVerifying,
    verifyDesignerRole,
    withDesignerVerification
  };
};

// Keep backward compatibility for existing code that uses useAdminVerification
export const useAdminVerification = useDesignerVerification;
