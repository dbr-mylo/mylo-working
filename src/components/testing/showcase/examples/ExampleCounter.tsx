
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSmokeTest } from '@/hooks/smoke-testing/useSmokeTest';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

interface ExampleCounterProps {
  onTestRunComplete?: (results: any[]) => void;
}

export const ExampleCounter: React.FC<ExampleCounterProps> = ({ onTestRunComplete }) => {
  const [count, setCount] = useState(0);
  
  // Initialize smoke test with component name and options
  const { testFeature, lastTestResult } = useSmokeTest(
    "ExampleCounter",
    [count], // Dependencies to watch
    { 
      category: "examples",
      context: { initialCount: 0 }
    }
  );
  
  // Test increment functionality
  const increment = () => {
    const prevCount = count;
    setCount(prevCount + 1);
    
    // Test if the increment worked as expected
    testFeature("increment", () => {
      if (count !== prevCount + 1) {
        throw new Error("Increment failed");
      }
    });
  };
  
  // Test decrement functionality
  const decrement = () => {
    const prevCount = count;
    setCount(prevCount - 1);
    
    // Test if the decrement worked as expected
    testFeature("decrement", () => {
      if (count !== prevCount - 1) {
        throw new Error("Decrement failed");
      }
    });
  };
  
  // Add a bug (intentionally for demo)
  const buggyOperation = () => {
    setCount(0); // Reset without checking
    
    // This test will fail as we're not properly tracking state
    testFeature("resetCounter", () => {
      throw new Error("This operation has a known bug (for demonstration)");
    });
  };
  
  // Report test results to parent
  useEffect(() => {
    if (lastTestResult && onTestRunComplete) {
      onTestRunComplete([lastTestResult]);
    }
  }, [lastTestResult, onTestRunComplete]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">{count}</div>
        
        {lastTestResult && (
          <Badge variant={lastTestResult.passed ? "outline" : "destructive"} 
                className={lastTestResult.passed ? "border-green-500 text-green-500" : ""}>
            {lastTestResult.passed ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Test Passed
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 mr-1" />
                Test Failed
              </>
            )}
          </Badge>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button onClick={increment}>Increment</Button>
        <Button onClick={decrement} variant="outline">Decrement</Button>
        <Button onClick={buggyOperation} variant="destructive">
          Reset (Buggy)
        </Button>
      </div>
      
      <div className="text-sm space-y-2">
        <p className="font-medium">How it works:</p>
        <p className="text-muted-foreground">
          Each button operation is wrapped with a test that verifies the state is updated correctly.
          The "Reset" button intentionally fails its test to demonstrate test error reporting.
        </p>
      </div>
    </div>
  );
};
