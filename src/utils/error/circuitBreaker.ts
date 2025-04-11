/**
 * Circuit Breaker Pattern Implementation
 * 
 * The circuit breaker prevents calling a service that is likely to fail,
 * following these states:
 * 
 * - CLOSED: Service calls proceed normally
 * - OPEN: Circuit is tripped, calls fail fast
 * - HALF_OPEN: Testing if service has recovered
 * 
 * State Transitions:
 * CLOSED → OPEN: When failure count reaches threshold
 * OPEN → HALF-OPEN: After reset timeout period
 * HALF-OPEN → CLOSED: When a test call succeeds
 * HALF-OPEN → OPEN: When a test call fails
 * 
 * Benefits:
 * - Prevents overwhelming failing services
 * - Provides fast failure for known issues
 * - Allows automatic recovery after failures
 * - Improves system resilience
 * 
 * Usage Examples:
 * 
 * 1. Basic usage with a function:
 * ```typescript
 * const protectedApiCall = createCircuitBreaker(fetchUserData);
 * try {
 *   const userData = await protectedApiCall(userId);
 * } catch (error) {
 *   // Handle error or circuit open state
 *   if (error.message.includes('circuit breaker')) {
 *     // Handle circuit is open
 *     showFallbackUserData();
 *   } else {
 *     // Handle regular API error
 *     showErrorMessage(error);
 *   }
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
 *       displayOfflineMode();
 *     } else {
 *       // Handle actual API error
 *       showApiErrorMessage(error);
 *     }
 *   }
 * }
 * ```
 * 
 * 4. Network error handling:
 * ```typescript
 * const networkCircuitBreaker = new CircuitBreaker({
 *   failureThreshold: 2,
 *   resetTimeout: 5000
 * });
 * 
 * async function fetchWithCircuitBreaker(url) {
 *   try {
 *     return await networkCircuitBreaker.execute(() => fetch(url));
 *   } catch (error) {
 *     // Check if it's a circuit breaker error or a network error
 *     if (error.message.includes('circuit breaker')) {
 *       console.log('Network appears to be down, using cached data');
 *       return getCachedData(url);
 *     } else {
 *       throw error; // Re-throw other errors
 *     }
 *   }
 * }
 * ```
 * 
 * 5. Auth error handling:
 * ```typescript
 * const authCircuitBreaker = new CircuitBreaker({
 *   failureThreshold: 3,
 *   resetTimeout: 30000
 * });
 * 
 * async function authenticatedRequest() {
 *   try {
 *     return await authCircuitBreaker.execute(async () => {
 *       const token = await getAuthToken();
 *       return api.makeRequest(token);
 *     });
 *   } catch (error) {
 *     if (error.message.includes('circuit breaker')) {
 *       // Auth service is down
 *       return promptUserToLogin();
 *     } else if (error.status === 401) {
 *       // Authentication issue but service is responsive
 *       return refreshToken();
 *     } else {
 *       throw error;
 *     }
 *   }
 * }
 * ```
 * 
 * 6. Using circuit breaker with listeners:
 * ```typescript
 * const paymentCircuitBreaker = new CircuitBreaker();
 * 
 * // Add state change listener
 * paymentCircuitBreaker.onStateChange((newState, oldState) => {
 *   if (newState === 'OPEN') {
 *     notifyAdmins('Payment processor appears to be down');
 *     showMaintenanceMessage();
 *   } else if (newState === 'CLOSED' && oldState === 'OPEN') {
 *     notifyAdmins('Payment processor recovered');
 *     hideMaintenanceMessage();
 *   }
 * });
 * 
 * // Use the circuit breaker
 * async function processPayment(paymentInfo) {
 *   return await paymentCircuitBreaker.execute(() => 
 *     paymentApi.processPayment(paymentInfo)
 *   );
 * }
 * ```
 */

/**
 * Circuit breaker state
 */
interface CircuitBreakerState {
  /**
   * Number of consecutive failures
   */
  failures: number;
  
  /**
   * Timestamp of the last failure in milliseconds
   */
  lastFailure: number | null;
  
  /**
   * Current status of the circuit breaker
   * - CLOSED: Normal operation, calls pass through
   * - OPEN: Circuit is tripped, calls fail fast
   * - HALF_OPEN: Testing if service has recovered
   */
  status: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  /** 
   * Failure threshold before opening the circuit
   * Default: 5
   */
  failureThreshold?: number;
  
  /** 
   * Time in milliseconds before trying to half-open the circuit
   * Default: 30000 (30 seconds)
   */
  resetTimeout?: number;
  
  /** 
   * Maximum number of calls allowed in half-open state
   * Default: 1
   */
  halfOpenCalls?: number;
  
  /**
   * Optional name for the circuit breaker (useful for logging)
   */
  name?: string;
}

const DEFAULT_CIRCUIT_BREAKER_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  resetTimeout: 30000, // 30 seconds
  halfOpenCalls: 1,
  name: 'default'
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
  private stateTransitionHistory: Array<{
    from: CircuitBreakerState['status'], 
    to: CircuitBreakerState['status'], 
    timestamp: number
  }> = [];
  
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
    
    // Log creation of circuit breaker
    console.info(`[CircuitBreaker:${this.config.name}] Created with settings:`, {
      failureThreshold: this.config.failureThreshold,
      resetTimeout: `${this.config.resetTimeout}ms`,
      halfOpenCalls: this.config.halfOpenCalls
    });
  }
  
  /**
   * Add a listener for state changes
   * @param listener Function that receives the new and old state
   * @returns Function to remove the listener
   * 
   * @example
   * ```typescript
   * const unsubscribe = circuitBreaker.onStateChange((newState, oldState) => {
   *   if (newState === 'OPEN') {
   *     showServiceUnavailableMessage();
   *   } else if (newState === 'CLOSED') {
   *     hideServiceUnavailableMessage();
   *   }
   * });
   * 
   * // Later, remove the listener
   * unsubscribe();
   * ```
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
   * 
   * @example
   * ```typescript
   * try {
   *   const data = await circuitBreaker.execute(async () => {
   *     const response = await fetch('https://api.example.com/data');
   *     if (!response.ok) throw new Error('API request failed');
   *     return response.json();
   *   });
   *   
   *   // Use successful data
   *   updateUI(data);
   * } catch (error) {
   *   // Handle error
   *   if (error.message.includes('circuit breaker')) {
   *     showServiceUnavailableMessage();
   *   } else {
   *     showErrorMessage(error);
   *   }
   * }
   * ```
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Log execution if not in CLOSED state
    if (this.state.status !== 'CLOSED') {
      console.info(`[CircuitBreaker:${this.config.name}] Execute called in ${this.state.status} state`);
    }
    
    if (this.state.status === 'OPEN') {
      // Check if it's time to try again
      if (this.state.lastFailure && 
          Date.now() - this.state.lastFailure >= this.config.resetTimeout) {
        this.halfOpen();
      } else {
        const remainingTime = this.state.lastFailure 
          ? Math.round((this.config.resetTimeout - (Date.now() - this.state.lastFailure)) / 1000)
          : this.config.resetTimeout / 1000;
          
        console.info(`[CircuitBreaker:${this.config.name}] Circuit is OPEN, request rejected. Will try again in ~${remainingTime}s`);
        throw new Error(`Service unavailable (circuit breaker ${this.config.name} open)`);
      }
    }
    
    if (this.state.status === 'HALF_OPEN' && 
        this.halfOpenCallsCount >= this.config.halfOpenCalls) {
      console.info(`[CircuitBreaker:${this.config.name}] Too many calls in HALF_OPEN state, request rejected`);
      throw new Error(`Service unavailable (circuit breaker ${this.config.name} half-open limit reached)`);
    }
    
    if (this.state.status === 'HALF_OPEN') {
      console.info(`[CircuitBreaker:${this.config.name}] Test call ${this.halfOpenCallsCount + 1}/${this.config.halfOpenCalls} in HALF_OPEN state`);
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
      console.info(`[CircuitBreaker:${this.config.name}] Circuit breaker reset (success in HALF_OPEN state)`);
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
    
    console.info(`[CircuitBreaker:${this.config.name}] Circuit breaker failure count: ${this.state.failures}/${this.config.failureThreshold}`);
    
    if (this.state.status === 'HALF_OPEN' || 
        (this.state.status === 'CLOSED' && this.state.failures >= this.config.failureThreshold)) {
      this.open();
    }
  }
  
  /**
   * Open the circuit breaker - all calls will be rejected
   */
  private open(): void {
    const oldStatus = this.state.status;
    this.state.status = 'OPEN';
    console.info(`[CircuitBreaker:${this.config.name}] Circuit OPENED`);
    this.recordStateTransition(oldStatus, 'OPEN');
    this.notifyStateChange('OPEN', oldStatus);
  }
  
  /**
   * Half-open the circuit breaker - allow limited test calls
   */
  private halfOpen(): void {
    const oldStatus = this.state.status;
    this.state.status = 'HALF_OPEN';
    this.halfOpenCallsCount = 0;
    console.info(`[CircuitBreaker:${this.config.name}] Circuit HALF-OPEN`);
    this.recordStateTransition(oldStatus, 'HALF_OPEN');
    this.notifyStateChange('HALF_OPEN', oldStatus);
  }
  
  /**
   * Close the circuit breaker - normal operation resumes
   */
  private close(): void {
    const oldStatus = this.state.status;
    this.state.status = 'CLOSED';
    this.state.failures = 0;
    this.halfOpenCallsCount = 0;
    console.info(`[CircuitBreaker:${this.config.name}] Circuit CLOSED`);
    this.recordStateTransition(oldStatus, 'CLOSED');
    this.notifyStateChange('CLOSED', oldStatus);
  }

  /**
   * Record a state transition for analytics
   */
  private recordStateTransition(
    from: CircuitBreakerState['status'], 
    to: CircuitBreakerState['status']
  ): void {
    this.stateTransitionHistory.push({
      from,
      to,
      timestamp: Date.now()
    });
    
    // Keep history to a reasonable size
    if (this.stateTransitionHistory.length > 100) {
      this.stateTransitionHistory.shift();
    }
  }

  /**
   * Notify all listeners about state changes
   */
  private notifyStateChange(newState: CircuitBreakerState['status'], oldState: CircuitBreakerState['status']): void {
    this.stateChangeListeners.forEach(listener => {
      try {
        listener(newState, oldState);
      } catch (error) {
        console.error(`[CircuitBreaker:${this.config.name}] Error in circuit breaker state change listener:`, error);
      }
    });
  }
  
  /**
   * Get the current status of the circuit breaker
   * @returns Current state: CLOSED, OPEN, or HALF_OPEN
   * 
   * @example
   * ```typescript
   * // Check the current status before making a call
   * if (apiCircuitBreaker.getStatus() === 'OPEN') {
   *   console.log('Service is currently unavailable');
   *   return getFromCache(); // Fallback
   * }
   * ```
   */
  getStatus(): 'CLOSED' | 'OPEN' | 'HALF_OPEN' {
    return this.state.status;
  }
  
  /**
   * Get current failure count
   * @returns Number of consecutive failures
   */
  getFailureCount(): number {
    return this.state.failures;
  }
  
  /**
   * Get time since last failure in milliseconds
   * @returns Time in ms since last failure, or null if no failures
   */
  getTimeSinceLastFailure(): number | null {
    if (!this.state.lastFailure) return null;
    return Date.now() - this.state.lastFailure;
  }
  
  /**
   * Get state transition history
   * @returns Array of recent state transitions
   */
  getStateTransitionHistory() {
    return [...this.stateTransitionHistory];
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
    console.info(`[CircuitBreaker:${this.config.name}] Circuit manually RESET`);
    this.notifyStateChange('CLOSED', oldStatus);
  }
  
  /**
   * Get circuit breaker configuration
   * @returns Current configuration
   */
  getConfig(): Required<CircuitBreakerConfig> {
    return { ...this.config };
  }
}

/**
 * Create a function with circuit breaker protection
 * @param fn The function to protect 
 * @param config Circuit breaker configuration
 * @returns A protected function that will throw if circuit is open
 * 
 * @example
 * ```typescript
 * // Create a protected API call
 * const fetchProductsWithBreaker = createCircuitBreaker(fetchProducts);
 * 
 * // Use it like the original function, but with circuit breaker protection
 * try {
 *   const products = await fetchProductsWithBreaker(categoryId);
 *   displayProducts(products);
 * } catch (error) {
 *   if (error.message.includes('circuit breaker')) {
 *     showCachedProducts(categoryId);
 *   } else {
 *     showError('Failed to load products');
 *   }
 * }
 * ```
 */
export function createCircuitBreaker<T extends (...args: any[]) => Promise<any>>(
  fn: T, 
  config: CircuitBreakerConfig = {}
): T {
  const circuitBreaker = new CircuitBreaker({
    ...config,
    name: config.name || fn.name || 'anonymous-function'
  });
  
  // Use type assertion to fix the type mismatch
  return ((...args: Parameters<T>): ReturnType<T> => {
    return circuitBreaker.execute(() => fn(...args)) as ReturnType<T>;
  }) as unknown as T;
}
