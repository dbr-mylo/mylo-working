
import { supabase } from '@/integrations/supabase/client';
import { CircuitBreaker } from '@/utils/error/circuitBreaker';
import { classifyError, ErrorCategory } from '@/utils/error/errorClassifier';
import { toast } from 'sonner';

/**
 * Result of a session recovery attempt
 */
export interface SessionRecoveryResult {
  recovered: boolean;
  reason?: string;
  shouldRedirect?: boolean;
  redirectTo?: string;
}

/**
 * Session recovery options
 */
export interface SessionRecoveryOptions {
  /** Maximum number of retry attempts */
  maxRetries?: number;
  /** Show toast notifications during recovery */
  showNotifications?: boolean;
  /** Callback when session state changes */
  onSessionStateChange?: (isValid: boolean) => void;
}

/**
 * Service that handles recovery of user sessions after errors
 * Implements token refresh, auto-recovery, and graceful degradation
 * for authentication-related errors
 */
export class SessionRecoveryService {
  private authCircuitBreaker: CircuitBreaker;
  private recoveryAttempts: number = 0;
  private refreshInProgress: boolean = false;
  private options: Required<SessionRecoveryOptions>;
  
  constructor(options: SessionRecoveryOptions = {}) {
    this.options = {
      maxRetries: 3,
      showNotifications: true,
      onSessionStateChange: () => {},
      ...options
    };
    
    this.authCircuitBreaker = new CircuitBreaker({
      failureThreshold: 3,
      resetTimeout: 30000, // 30 seconds
      halfOpenCalls: 1
    });
    
    // Listen for circuit breaker state changes
    this.authCircuitBreaker.onStateChange((newState, oldState) => {
      if (newState === 'OPEN' && oldState !== 'OPEN') {
        if (this.options.showNotifications) {
          toast.error('Authentication service unavailable', {
            description: 'Please try signing in again later.',
            duration: 5000
          });
        }
        this.options.onSessionStateChange(false);
      } else if (newState === 'CLOSED' && oldState !== 'CLOSED') {
        if (this.options.showNotifications) {
          toast.success('Authentication service restored', {
            description: 'You can continue using the application.',
            duration: 3000
          });
        }
        this.options.onSessionStateChange(true);
      }
    });
  }
  
  /**
   * Attempt to refresh the session when encountering auth errors
   * @returns Session recovery result
   */
  public async recoverSession(): Promise<SessionRecoveryResult> {
    // Prevent concurrent recovery attempts
    if (this.refreshInProgress) {
      return { recovered: false, reason: 'refresh_in_progress' };
    }
    
    // Check if we've exceeded max retries
    if (this.recoveryAttempts >= this.options.maxRetries) {
      return { 
        recovered: false, 
        reason: 'max_retries_exceeded',
        shouldRedirect: true,
        redirectTo: '/auth'
      };
    }
    
    try {
      this.refreshInProgress = true;
      this.recoveryAttempts++;
      
      // Use circuit breaker to protect against repeated auth service failures
      return await this.authCircuitBreaker.execute(async () => {
        // First check if we actually have a valid session 
        const { data: sessionData } = await supabase.auth.getSession();
        const currentSession = sessionData?.session;
        
        if (!currentSession) {
          return { 
            recovered: false, 
            reason: 'no_session',
            shouldRedirect: true,
            redirectTo: '/auth'
          };
        }
        
        // Attempt to refresh the session
        const { data, error } = await supabase.auth.refreshSession();
        
        if (error) {
          console.error('Session refresh failed:', error);
          throw error;
        }
        
        if (data.session) {
          console.log('Session successfully refreshed');
          this.recoveryAttempts = 0; // Reset counter on success
          
          if (this.options.showNotifications) {
            toast.success('Session recovered', {
              description: 'Your session has been restored.',
              duration: 3000
            });
          }
          
          return { recovered: true };
        }
        
        return { 
          recovered: false, 
          reason: 'refresh_failed',
          shouldRedirect: true,
          redirectTo: '/auth'
        };
      });
    } catch (error) {
      console.error('Session recovery error:', error);
      
      // Handle auth service being completely unavailable
      const classifiedError = classifyError(error, 'session_recovery');
      
      if (classifiedError.category === ErrorCategory.AUTH) {
        return { 
          recovered: false, 
          reason: 'auth_error',
          shouldRedirect: true,
          redirectTo: '/auth'
        };
      }
      
      return { 
        recovered: false, 
        reason: 'unexpected_error'
      };
    } finally {
      this.refreshInProgress = false;
    }
  }
  
  /**
   * Handle authentication error with recovery attempt
   * @param error The error to handle
   * @param context Error context
   * @returns Recovery result
   */
  public async handleAuthError(error: unknown, context: string): Promise<SessionRecoveryResult> {
    const classifiedError = classifyError(error, context);
    
    // Only attempt recovery for auth-related errors
    if (classifiedError.category !== ErrorCategory.AUTH) {
      return { recovered: false, reason: 'not_auth_error' };
    }
    
    // Check for specific auth errors that indicate session issues
    const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';
    
    const isSessionError = 
      errorMessage.includes('jwt') || 
      errorMessage.includes('token') || 
      errorMessage.includes('session') ||
      errorMessage.includes('authentication') ||
      errorMessage.includes('unauthorized');
    
    if (!isSessionError) {
      return { recovered: false, reason: 'not_session_error' };
    }
    
    // Attempt to recover the session
    return await this.recoverSession();
  }
  
  /**
   * Reset the recovery attempts counter
   */
  public resetRecoveryAttempts(): void {
    this.recoveryAttempts = 0;
  }
  
  /**
   * Get the current circuit breaker status
   */
  public getAuthServiceStatus(): 'CLOSED' | 'OPEN' | 'HALF_OPEN' {
    return this.authCircuitBreaker.getStatus();
  }
}

// Export a singleton instance for app-wide use
export const sessionRecoveryService = new SessionRecoveryService();
