
/**
 * Circuit breaker pattern implementation
 * 
 * The circuit breaker prevents calling a service that is likely to fail,
 * following the pattern:
 * 
 * - CLOSED: Service calls proceed normally
 * - OPEN: Service calls are blocked (circuit is "tripped")
 * - HALF-OPEN: Limited test calls are allowed to check if service has recovered
 * 
 * Usage examples:
 * 
 * 1. Basic usage with a function:
 * ```typescript
 * const protectedApiCall = createCircuitBreaker(fetchUserData);
 * try {
 *   const userData = await protectedApiCall(userId);
 * } catch (error) {
 *   // Handle error or circuit open state
 * }
 * ```
 * 
 * 2. With custom configuration:
 * ```typescript
 * const protectedApiCall = createCircuitBreaker(fetchUserData, {
 *   failureThreshold: 3,     // Open after 3 failures
 *   resetTimeout: 10000,     // Try again after 10 seconds
 *   halfOpenCalls: 2         // Allow 2 test calls in half-open state
 * });
 * ```
 * 
 * 3. Direct circuit breaker instantiation:
 * ```typescript
 * const apiCircuitBreaker = new CircuitBreaker();
 * 
 * async function callProtectedApi() {
 *   try {
 *     return await apiCircuitBreaker.execute(() => api.getData());
 *   } catch (error) {
 *     if (error.message.includes('circuit breaker')) {
 *       // Handle circuit open state
 *     } else {
 *       // Handle actual API error
 *     }
 *   }
 * }
 * ```
 */

/**
 * Circuit breaker state
 */
interface CircuitBreakerState {
  failures: number;
  lastFailure: number | null;
  status: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  /** Failure threshold before opening the circuit */
  failureThreshold?: number;
  /** Time in milliseconds before trying to half-open the circuit */
  resetTimeout?: number;
  /** Maximum number of calls in half-open state */
  halfOpenCalls?: number;
}

const DEFAULT_CIRCUIT_BREAKER_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  resetTimeout: 30000, // 30 seconds
  halfOpenCalls: 1,
};

/**
 * Circuit breaker pattern implementation
 * Prevents calling a service that is likely to fail
 */
export class CircuitBreaker {
  private state: CircuitBreakerState;
  private config: Required<CircuitBreakerConfig>;
  private halfOpenCallsCount: number = 0;
  private stateChangeListeners: Array<(newState: CircuitBreakerState['status'], oldState: CircuitBreakerState['status']) => void> = [];
  
  /**
   * Create a new circuit breaker
   * @param config Circuit breaker configuration
   */
  constructor(config: CircuitBreakerConfig = {}) {
    this.config = {
      ...DEFAULT_CIRCUIT_BREAKER_CONFIG,
      ...config
    } as Required<CircuitBreakerConfig>;
    
    this.state = {
      failures: 0,
      lastFailure: null,
      status: 'CLOSED'
    };
  }
  
  /**
   * Add a listener for state changes
   * @param listener Function that receives the new and old state
   * @returns Function to remove the listener
   */
  public onStateChange(listener: (newState: CircuitBreakerState['status'], oldState: CircuitBreakerState['status']) => void): () => void {
    this.stateChangeListeners.push(listener);
    return () => {
      this.stateChangeListeners = this.stateChangeListeners.filter(l => l !== listener);
    };
  }
  
  /**
   * Execute a function with circuit breaker protection
   * @param fn The function to execute
   * @returns The result of the function
   * @throws Error if the circuit is open or the function fails
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state.status === 'OPEN') {
      // Check if it's time to try again
      if (this.state.lastFailure && 
          Date.now() - this.state.lastFailure >= this.config.resetTimeout) {
        this.halfOpen();
      } else {
        console.info('[Analytics] Circuit breaker is OPEN, request rejected');
        throw new Error('Service unavailable (circuit breaker open)');
      }
    }
    
    if (this.state.status === 'HALF_OPEN' && 
        this.halfOpenCallsCount >= this.config.halfOpenCalls) {
      console.info('[Analytics] Too many calls in HALF_OPEN state, request rejected');
      throw new Error('Service unavailable (circuit breaker half-open limit reached)');
    }
    
    if (this.state.status === 'HALF_OPEN') {
      this.halfOpenCallsCount++;
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  /**
   * Handle successful execution
   */
  private onSuccess(): void {
    if (this.state.status === 'HALF_OPEN') {
      console.info('[Analytics] Circuit breaker reset (success in HALF_OPEN state)');
      this.close();
    }
    
    // Reset failure count in closed state
    if (this.state.status === 'CLOSED') {
      this.state.failures = 0;
    }
  }
  
  /**
   * Handle failed execution
   */
  private onFailure(): void {
    this.state.failures++;
    this.state.lastFailure = Date.now();
    
    console.info(`[Analytics] Circuit breaker failure count: ${this.state.failures}/${this.config.failureThreshold}`);
    
    if (this.state.status === 'HALF_OPEN' || 
        (this.state.status === 'CLOSED' && this.state.failures >= this.config.failureThreshold)) {
      this.open();
    }
  }
  
  /**
   * Open the circuit breaker
   */
  private open(): void {
    const oldStatus = this.state.status;
    this.state.status = 'OPEN';
    console.info('[Analytics] Circuit breaker OPENED');
    this.notifyStateChange('OPEN', oldStatus);
  }
  
  /**
   * Half-open the circuit breaker
   */
  private halfOpen(): void {
    const oldStatus = this.state.status;
    this.state.status = 'HALF_OPEN';
    this.halfOpenCallsCount = 0;
    console.info('[Analytics] Circuit breaker HALF-OPEN');
    this.notifyStateChange('HALF_OPEN', oldStatus);
  }
  
  /**
   * Close the circuit breaker
   */
  private close(): void {
    const oldStatus = this.state.status;
    this.state.status = 'CLOSED';
    this.state.failures = 0;
    this.halfOpenCallsCount = 0;
    console.info('[Analytics] Circuit breaker CLOSED');
    this.notifyStateChange('CLOSED', oldStatus);
  }

  /**
   * Notify all listeners about state changes
   */
  private notifyStateChange(newState: CircuitBreakerState['status'], oldState: CircuitBreakerState['status']): void {
    this.stateChangeListeners.forEach(listener => {
      try {
        listener(newState, oldState);
      } catch (error) {
        console.error('Error in circuit breaker state change listener:', error);
      }
    });
  }
  
  /**
   * Get the current status of the circuit breaker
   */
  getStatus(): 'CLOSED' | 'OPEN' | 'HALF_OPEN' {
    return this.state.status;
  }
  
  /**
   * Get current failure count
   */
  getFailureCount(): number {
    return this.state.failures;
  }
  
  /**
   * Get time since last failure in milliseconds
   */
  getTimeSinceLastFailure(): number | null {
    if (!this.state.lastFailure) return null;
    return Date.now() - this.state.lastFailure;
  }
  
  /**
   * Reset the circuit breaker to its initial closed state
   */
  reset(): void {
    const oldStatus = this.state.status;
    this.state.status = 'CLOSED';
    this.state.failures = 0;
    this.halfOpenCallsCount = 0;
    this.state.lastFailure = null;
    this.notifyStateChange('CLOSED', oldStatus);
  }
}

/**
 * Create a function with circuit breaker protection
 * @param fn The function to protect 
 * @param config Circuit breaker configuration
 * @returns A protected function that will throw if circuit is open
 */
export function createCircuitBreaker<T extends (...args: any[]) => Promise<any>>(
  fn: T, 
  config: CircuitBreakerConfig = {}
): T {
  const circuitBreaker = new CircuitBreaker(config);
  
  // Use type assertion to fix the type mismatch
  return ((...args: Parameters<T>): ReturnType<T> => {
    return circuitBreaker.execute(() => fn(...args)) as ReturnType<T>;
  }) as unknown as T;
}
