
import { UserRole } from "../types";

export interface AuthState {
  user: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  error: Error | null;
}

export interface UserProfile {
  id: string;
  email?: string;
  role?: UserRole;
  [key: string]: any;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuestEditor: () => void;
  continueAsGuestDesigner: () => void;
  continueAsGuestAdmin: () => void;
  clearError: () => void;
  clearGuestRole: () => boolean;
  isAuthenticated: boolean;
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
  expiresAt: number;
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

export enum AuthErrorCode {
  InvalidCredentials = "auth/invalid-credentials",
  UserNotFound = "auth/user-not-found",
  EmailAlreadyInUse = "auth/email-already-in-use",
  WeakPassword = "auth/weak-password",
  NetworkError = "auth/network-error",
  UnknownError = "auth/unknown-error",
  InvalidRole = "auth/invalid-role",
  SessionExpired = "auth/session-expired",
  StorageError = "auth/storage-error"
}

export type AuthErrorType = 
  | "signIn" 
  | "signUp" 
  | "signOut" 
  | "session" 
  | "role" 
  | "storage";

export interface AuthErrorOptions {
  code?: AuthErrorCode;
  context?: string;
  originalError?: unknown;
}
