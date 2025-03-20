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
  displayName?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  lastSignInAt?: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, any>;
  [key: string]: any;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuestEditor: () => void;
  continueAsGuestDesigner: () => void;
  clearError: () => void;
  clearGuestRole: () => boolean;
  isAuthenticated: boolean;
  refreshUserData: () => Promise<void>;
  updateUserProfile?: (data: Partial<UserProfile>) => Promise<void>;
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
  metadata?: Record<string, any>;
}

export interface AuthSession {
  user: {
    id: string;
    email?: string;
    role?: UserRole;
    [key: string]: any;
  } | null;
  error: Error | null;
  expires_at?: number;
}

export enum AuthErrorCode {
  // Sign in errors
  InvalidCredentials = "auth/invalid-credentials",
  UserNotFound = "auth/user-not-found",
  
  // Sign up errors
  EmailAlreadyInUse = "auth/email-already-in-use",
  WeakPassword = "auth/weak-password",
  InvalidEmail = "auth/invalid-email",
  
  // General errors
  NetworkError = "auth/network-error",
  UnknownError = "auth/unknown-error",
  
  // Role errors
  InvalidRole = "auth/invalid-role",
  
  // Session errors
  SessionExpired = "auth/session-expired",
  
  // Storage errors
  StorageError = "auth/storage-error",
  
  // Permissions
  PermissionDenied = "auth/permission-denied",
  
  // Account status
  AccountDisabled = "auth/account-disabled",
  
  // Rate limiting
  TooManyRequests = "auth/too-many-requests"
}

export type AuthErrorType = 
  | "signIn" 
  | "signUp" 
  | "signOut" 
  | "session" 
  | "role" 
  | "storage"
  | "permission";

export interface AuthErrorOptions {
  code?: AuthErrorCode;
  context?: string;
  originalError?: unknown;
  metadata?: Record<string, any>;
}

export interface AuthErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

export interface RoleValidationResult {
  isAuthorized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  handleUnauthorized: (message?: string) => void;
}

export interface AuthValidationResult {
  isAuthenticated: boolean;
  isLoading: boolean;
  handleUnauthenticated: (message?: string) => void;
}
