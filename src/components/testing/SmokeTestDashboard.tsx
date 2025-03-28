
import React, { useState, useEffect } from "react";
import { smokeTestRunner } from "@/utils/testing/smokeTesting";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, Play } from "lucide-react";
import { toast } from "sonner";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";

/**
 * A component that deliberately throws an error to test error boundaries
 */
const ErrorComponent = () => {
  useEffect(() => {
    throw new Error("This is a test error from ErrorComponent");
  }, []);
  
  return <div>This will never render</div>;
};

/**
 * Dashboard for running smoke tests 
 */
export const SmokeTestDashboard = () => {
  const [results, setResults] = useState(smokeTestRunner.getResults());
  const [showErrorTest, setShowErrorTest] = useState(false);
  const [testEnabled, setTestEnabled] = useState(
    process.env.NODE_ENV === 'development'
  );
  
  // Update results every second
  useEffect(() => {
    const interval = setInterval(() => {
      setResults(smokeTestRunner.getResults());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const summary = smokeTestRunner.getSummary();
  
  const toggleTests = () => {
    const newState = !testEnabled;
    smokeTestRunner.setEnabled(newState);
    setTestEnabled(newState);
    toast(newState ? "Tests enabled" : "Tests disabled");
  };
  
  const clearResults = () => {
    smokeTestRunner.clearResults();
    setResults([]);
    toast("Test results cleared");
  };
  
  const runErrorTest = () => {
    setShowErrorTest(true);
    setTimeout(() => setShowErrorTest(false), 2000);
  };
  
  return (
    <ErrorBoundary context="SmokeTestDashboard">
      <div className="container mx-auto py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Smoke Test Dashboard</CardTitle>
            <CardDescription>
              Monitor component render tests across the application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div className="stats space-x-4">
                <span className="font-medium">Total: {summary.total}</span>
                <span className="text-green-600 font-medium">Passed: {summary.passed}</span>
                <span className="text-red-600 font-medium">Failed: {summary.failed}</span>
              </div>
              <div className="space-x-2">
                <Button variant={testEnabled ? "default" : "outline"} onClick={toggleTests}>
                  {testEnabled ? "Disable Tests" : "Enable Tests"}
                </Button>
                <Button variant="outline" onClick={clearResults}>
                  Clear Results
                </Button>
                <Button variant="destructive" onClick={runErrorTest}>
                  <Play className="h-4 w-4 mr-2" />
                  Test Error
                </Button>
              </div>
            </div>
            
            {/* Error test component */}
            {showErrorTest && (
              <ErrorBoundary 
                context="ErrorTest" 
                fallback={
                  <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Test Error Caught</AlertTitle>
                    <AlertDescription>
                      The error boundary successfully caught a test error.
                    </AlertDescription>
                  </Alert>
                }
              >
                <ErrorComponent />
              </ErrorBoundary>
            )}
            
            {/* Results table */}
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Component
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.length > 0 ? (
                    results.map((result, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {result.component}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {result.passed ? (
                            <span className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" /> Passed
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600">
                              <XCircle className="h-4 w-4 mr-1" /> Failed
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {result.timestamp.toLocaleTimeString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                        No test results yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-gray-500">
            Smoke tests run automatically when components mount. Failed tests are logged to the console.
          </CardFooter>
        </Card>
      </div>
    </ErrorBoundary>
  );
};
