
import { supabase } from '@/integrations/supabase/client';
import { CircuitBreaker } from '@/utils/error/circuitBreaker';
import { classifyError, ErrorCategory } from '@/utils/error/errorClassifier';
import { toast } from 'sonner';
import { getLocalStorage, setLocalStorage } from '@/utils/storage/localStorage';

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
  /** Enable persistence across page refreshes */
  enablePersistence?: boolean;
}

/**
 * Session recovery metrics
 */
export interface SessionRecoveryMetrics {
  totalAttempts: number;
  successfulAttempts: number;
  failedAttempts: number;
  successRate: number;
  lastAttemptTimestamp: number | null;
  lastSuccessTimestamp: number | null;
  lastFailureTimestamp: number | null;
  averageRecoveryTimeMs: number | null;
}

/**
 * Session recovery state stored in localStorage
 */
interface RecoveryState {
  recoveryAttempts: number;
  circuitBreakerStatus: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

// Local storage keys
const RECOVERY_METRICS_KEY = 'session_recovery_metrics';
const RECOVERY_STATE_KEY = 'session_recovery_state';

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
  private metrics: SessionRecoveryMetrics;
  
  constructor(options: SessionRecoveryOptions = {}) {
    this.options = {
      maxRetries: 3,
      showNotifications: true,
      onSessionStateChange: () => {},
      enablePersistence: true,
      ...options
    };
    
    this.authCircuitBreaker = new CircuitBreaker({
      failureThreshold: 3,
      resetTimeout: 30000, // 30 seconds
      halfOpenCalls: 1
    });
    
    // Initialize metrics
    this.metrics = this.loadMetricsFromStorage();
    
    // Restore recovery attempts from storage if persistence is enabled
    if (this.options.enablePersistence) {
      this.restoreStateFromStorage();
    }
    
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
      
      // Update state in storage if persistence is enabled
      if (this.options.enablePersistence) {
        this.persistStateToStorage();
      }
      
      // Track recovery metrics
      const startTime = performance.now();
      this.updateMetrics({ totalAttempts: this.metrics.totalAttempts + 1 });
      
      // Use circuit breaker to protect against repeated auth service failures
      return await this.authCircuitBreaker.execute(async () => {
        // First check if we actually have a valid session 
        const { data: sessionData } = await supabase.auth.getSession();
        const currentSession = sessionData?.session;
        
        if (!currentSession) {
          // Track failed attempt
          const endTime = performance.now();
          this.updateMetrics({ 
            failedAttempts: this.metrics.failedAttempts + 1,
            lastFailureTimestamp: Date.now()
          });
          
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
          
          // Track failed attempt
          const endTime = performance.now();
          this.updateMetrics({ 
            failedAttempts: this.metrics.failedAttempts + 1,
            lastFailureTimestamp: Date.now()
          });
          
          throw error;
        }
        
        if (data.session) {
          console.log('Session successfully refreshed');
          this.recoveryAttempts = 0; // Reset counter on success
          
          // Track successful attempt
          const endTime = performance.now();
          const recoveryTime = endTime - startTime;
          
          this.updateMetrics({ 
            successfulAttempts: this.metrics.successfulAttempts + 1,
            lastSuccessTimestamp: Date.now(),
            averageRecoveryTimeMs: this.calculateNewAverageTime(recoveryTime)
          });
          
          // Update state in storage after successful recovery
          if (this.options.enablePersistence) {
            this.persistStateToStorage();
          }
          
          if (this.options.showNotifications) {
            toast.success('Session recovered', {
              description: 'Your session has been restored.',
              duration: 3000
            });
          }
          
          return { recovered: true };
        }
        
        // Track failed attempt
        const endTime = performance.now();
        this.updateMetrics({ 
          failedAttempts: this.metrics.failedAttempts + 1,
          lastFailureTimestamp: Date.now()
        });
        
        return { 
          recovered: false, 
          reason: 'refresh_failed',
          shouldRedirect: true,
          redirectTo: '/auth'
        };
      });
    } catch (error) {
      console.error('Session recovery error:', error);
      
      // Track failed attempt
      this.updateMetrics({ 
        failedAttempts: this.metrics.failedAttempts + 1,
        lastFailureTimestamp: Date.now()
      });
      
      // Handle auth service being completely unavailable
      const classifiedError = classifyError(error, 'session_recovery');
      
      if (classifiedError.category === ErrorCategory.AUTH || 
          classifiedError.category === ErrorCategory.AUTHENTICATION) {
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
      
      // Update the last attempt timestamp
      this.updateMetrics({ 
        lastAttemptTimestamp: Date.now() 
      });
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
    if (classifiedError.category !== ErrorCategory.AUTH && 
        classifiedError.category !== ErrorCategory.AUTHENTICATION) {
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
    
    if (this.options.enablePersistence) {
      this.persistStateToStorage();
    }
  }
  
  /**
   * Get the current circuit breaker status
   */
  public getAuthServiceStatus(): 'CLOSED' | 'OPEN' | 'HALF_OPEN' {
    return this.authCircuitBreaker.getStatus();
  }
  
  /**
   * Get current recovery metrics
   */
  public getRecoveryMetrics(): SessionRecoveryMetrics {
    return { ...this.metrics };
  }
  
  /**
   * Persist recovery state to local storage
   */
  private persistStateToStorage(): void {
    try {
      const state: RecoveryState = {
        recoveryAttempts: this.recoveryAttempts,
        circuitBreakerStatus: this.authCircuitBreaker.getStatus()
      };
      
      setLocalStorage(RECOVERY_STATE_KEY, state);
    } catch (error) {
      console.error('Failed to persist recovery state:', error);
    }
  }
  
  /**
   * Restore recovery state from local storage
   */
  private restoreStateFromStorage(): void {
    try {
      const state = getLocalStorage<RecoveryState>(RECOVERY_STATE_KEY);
      
      if (state) {
        this.recoveryAttempts = state.recoveryAttempts || 0;
        
        // If the circuit was open, we don't automatically reopen it
        // This is a safety mechanism to prevent permanent lockout
        console.log('Restored recovery state:', state);
      }
    } catch (error) {
      console.error('Failed to restore recovery state:', error);
    }
  }
  
  /**
   * Update recovery metrics
   */
  private updateMetrics(updates: Partial<SessionRecoveryMetrics>): void {
    this.metrics = {
      ...this.metrics,
      ...updates
    };
    
    // Calculate success rate
    if (this.metrics.totalAttempts > 0) {
      this.metrics.successRate = this.metrics.successfulAttempts / this.metrics.totalAttempts;
    }
    
    // Save to storage
    this.persistMetricsToStorage();
  }
  
  /**
   * Load metrics from storage
   */
  private loadMetricsFromStorage(): SessionRecoveryMetrics {
    const defaultMetrics: SessionRecoveryMetrics = {
      totalAttempts: 0,
      successfulAttempts: 0,
      failedAttempts: 0,
      successRate: 0,
      lastAttemptTimestamp: null,
      lastSuccessTimestamp: null,
      lastFailureTimestamp: null,
      averageRecoveryTimeMs: null
    };
    
    try {
      const storedMetrics = getLocalStorage<SessionRecoveryMetrics>(RECOVERY_METRICS_KEY);
      return storedMetrics ? { ...defaultMetrics, ...storedMetrics } : defaultMetrics;
    } catch (error) {
      console.error('Failed to load recovery metrics:', error);
      return defaultMetrics;
    }
  }
  
  /**
   * Persist metrics to storage
   */
  private persistMetricsToStorage(): void {
    try {
      setLocalStorage(RECOVERY_METRICS_KEY, this.metrics);
    } catch (error) {
      console.error('Failed to persist recovery metrics:', error);
    }
  }
  
  /**
   * Calculate new average recovery time
   */
  private calculateNewAverageTime(newTime: number): number {
    if (this.metrics.averageRecoveryTimeMs === null) {
      return newTime;
    }
    
    const totalSuccessfulAttempts = this.metrics.successfulAttempts;
    
    if (totalSuccessfulAttempts <= 1) {
      return newTime;
    }
    
    // Using a weighted average to give more importance to recent measurements
    const weight = 0.3; // 30% weight to the new measurement
    return (this.metrics.averageRecoveryTimeMs * (1 - weight)) + (newTime * weight);
  }
}

// Export a singleton instance for app-wide use
export const sessionRecoveryService = new SessionRecoveryService();
