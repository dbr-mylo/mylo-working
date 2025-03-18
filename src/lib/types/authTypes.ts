
import { UserRole } from "../types";

export interface AuthState {
  user: any | null;
  role: UserRole | null;
  isLoading: boolean;
  error: Error | null;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuestEditor: () => void;
  continueAsGuestDesigner: () => void;
  continueAsGuestAdmin: () => void;
  clearError: () => void;
}

export interface AuthFormState {
  email: string;
  password: string;
  isSubmitting: boolean;
  activeTab: "signin" | "signup";
}

export interface GuestRoleState {
  role: UserRole;
  timestamp: number;
}

export interface AuthSession {
  user: {
    id: string;
    email?: string;
    role?: UserRole;
    [key: string]: any;
  } | null;
  error: Error | null;
}
