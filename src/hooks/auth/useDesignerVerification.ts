
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/lib/types';

/**
 * Hook to verify if a user should have the designer role
 */
export const useDesignerVerification = () => {
  const { user, role, refreshUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyDesignerRole = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Check if user has the designer role in the user_roles table
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        // If user has a designer role in the database but not in state, update state
        if (data?.role === 'designer' && role !== 'designer') {
          console.log('Setting user role to designer based on database verification');
          await refreshUserData();
        } 
        // If user doesn't have designer role in the database but has it in state, update state
        else if (data?.role !== 'designer' && role === 'designer') {
          console.log('User does not have designer privileges, updating role');
          await refreshUserData();
        }
      } catch (err) {
        console.error('Error verifying designer role:', err);
        setError('Failed to verify designer permissions');
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyDesignerRole();
  }, [user, role, refreshUserData]);
  
  return { isLoading, error };
};
