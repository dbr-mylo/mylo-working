
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/lib/types';

/**
 * Hook to verify if a user should have the designer role
 */
export const useDesignerVerification = () => {
  const { user, role, setRole } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyDesignerRole = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Check if user has the designer role in the profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        // If user has a designer role in the database but not in state, update state
        if (data?.role === 'designer' && role !== 'designer') {
          console.log('Setting user role to designer based on database verification');
          setRole('designer' as UserRole);
        } 
        // If user doesn't have designer role in the database but has it in state, update state
        else if (data?.role !== 'designer' && role === 'designer') {
          console.log('User does not have designer privileges, updating role');
          setRole('editor' as UserRole);
        }
      } catch (err) {
        console.error('Error verifying designer role:', err);
        setError('Failed to verify designer permissions');
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyDesignerRole();
  }, [user, role, setRole]);
  
  return { isLoading, error };
};
