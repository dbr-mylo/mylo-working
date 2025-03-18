
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SessionError, RoleError } from "@/lib/errors/authErrors";
import { UserRole } from "@/lib/types";
import { toast } from "sonner";
import { UserProfile } from "@/lib/types/authTypes";

interface UseUserDataProps {
  setUser: (user: UserProfile | null) => void;
  setRole: (role: UserRole | null) => void;
  setError: (error: any) => void;
}

/**
 * Hook for fetching and managing user data
 */
export const useUserData = ({
  setUser,
  setRole,
  setError
}: UseUserDataProps) => {
  // Fetch user profile and role data
  const fetchUserData = useCallback(async (userId: string) => {
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        throw new SessionError('Failed to fetch user profile', {
          originalError: profileError
        });
      }

      // Fetch user role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (roleError) {
        throw new RoleError('Failed to fetch user role', {
          originalError: roleError
        });
      }

      // Update state with user data and role
      setUser(profile);
      setRole(roleData.role as UserRole);
    } catch (error) {
      console.error("Error fetching user data:", error);
      
      const fetchError = error instanceof SessionError || error instanceof RoleError
        ? error
        : new SessionError("Failed to fetch user data", {
            originalError: error
          });
      
      setError(fetchError);
      
      toast.error(fetchError.getUserMessage());
      throw fetchError;
    }
  }, [setUser, setRole, setError]);

  return {
    fetchUserData
  };
};
