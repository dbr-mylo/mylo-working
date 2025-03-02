
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { AuthState, UserRole } from "./types";

export function useAuthMethods(
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) {
  const navigate = useNavigate();

  const fetchUserData = async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (roleError) throw roleError;

      setAuthState({
        user: profile,
        role: roleData.role as UserRole,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error fetching user data");
      setAuthState(state => ({ ...state, isLoading: false }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // Clear any stored guest role when authenticated with Supabase
      localStorage.removeItem('guestRole');
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      toast.success("Check your email to confirm your account");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear the guest role from localStorage when signing out
      localStorage.removeItem('guestRole');
      setAuthState({
        user: null,
        role: null,
        isLoading: false,
      });
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  return {
    fetchUserData,
    signIn,
    signUp,
    signOut
  };
}
