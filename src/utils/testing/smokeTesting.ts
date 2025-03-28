
import { toast } from "sonner";
import { SmokeTestResult } from "@/hooks/useSmokeTest";

/**
 * Simple in-browser smoke testing utility
 * Keeps track of component render tests
 */
class SmokeTestRunner {
  private results: SmokeTestResult[] = [];
  private enabled: boolean = false;
  
  /**
   * Enable or disable smoke testing
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    console.log(`Smoke testing ${enabled ? 'enabled' : 'disabled'}`);
  }
  
  /**
   * Test if a component renders without errors
   * @param componentName - Name of the component being tested
   * @param callback - Function that attempts to render the component
   * @returns Boolean indicating if the test passed
   */
  public testComponentRender(componentName: string, callback: () => void): boolean {
    if (!this.enabled) return true;
    
    try {
      // Execute the test
      callback();
      
      // Record success
      const result: SmokeTestResult = {
        component: componentName,
        passed: true,
        timestamp: new Date().toISOString(),
        error: undefined,
        context: {}
      };
      
      this.results.push(result);
      console.log(`✅ Smoke test passed: ${componentName}`);
      return true;
    } catch (error) {
      // Record failure
      const result: SmokeTestResult = {
        component: componentName,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
        context: {}
      };
      
      this.results.push(result);
      console.error(`❌ Smoke test failed: ${componentName}`, error);
      
      // Show toast notification in development only
      if (process.env.NODE_ENV === 'development') {
        toast.error(`Component render failed: ${componentName}`, {
          description: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      
      return false;
    }
  }
  
  /**
   * Get all test results
   */
  public getResults(): SmokeTestResult[] {
    return [...this.results];
  }
  
  /**
   * Get summary of test results
   */
  public getSummary(): { total: number; passed: number; failed: number } {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = total - passed;
    
    return { total, passed, failed };
  }
  
  /**
   * Clear all test results
   */
  public clearResults(): void {
    this.results = [];
  }
}

// Create a singleton instance
const smokeTestRunner = new SmokeTestRunner();

// Enable tests in development by default
if (process.env.NODE_ENV === 'development') {
  smokeTestRunner.setEnabled(true);
}

export { smokeTestRunner };
