
import type { UserRole } from "@/lib/types";

export interface AuthState {
  user: any | null;
  role: UserRole | null;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuestEditor: () => void;
  continueAsGuestDesigner: () => void;
}
