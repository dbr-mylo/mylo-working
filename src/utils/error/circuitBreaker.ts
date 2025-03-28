
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
    console.info('[Analytics] Circuit breaker OPENED');
    this.state.status = 'OPEN';
  }
  
  /**
   * Half-open the circuit breaker
   */
  private halfOpen(): void {
    console.info('[Analytics] Circuit breaker HALF-OPEN');
    this.state.status = 'HALF_OPEN';
    this.halfOpenCallsCount = 0;
  }
  
  /**
   * Close the circuit breaker
   */
  private close(): void {
    console.info('[Analytics] Circuit breaker CLOSED');
    this.state.status = 'CLOSED';
    this.state.failures = 0;
    this.halfOpenCallsCount = 0;
  }
  
  /**
   * Get the current status of the circuit breaker
   */
  getStatus(): 'CLOSED' | 'OPEN' | 'HALF_OPEN' {
    return this.state.status;
  }
}
