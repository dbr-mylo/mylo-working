
/**
 * Types for error handling utilities
 */

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorContext {
  feature?: string;
  component?: string;
  action?: string;
  userId?: string;
  role?: string;
  additionalInfo?: Record<string, any>;
}

export interface ErrorHandler {
  (error: unknown, context: string, userMessage?: string, shouldToast?: boolean): void;
}

export interface ErrorTracker {
  (error: unknown, context: string): void;
}

export interface RetryConfig {
  maxAttempts: number;
  delayMs?: number;
  backoff?: boolean;
  onRetry?: (attempt: number, error: unknown) => void;
}

// Update the ResolutionStep to be a ReactNode-compatible interface
export interface ResolutionStep {
  id: string;
  description: string;
  automated?: boolean;
  action?: () => Promise<boolean>;
  successMessage?: string;
  failureMessage?: string;
}

// Also export string type as valid ResolutionStep for backwards compatibility
export type LegacyResolutionStep = string;
