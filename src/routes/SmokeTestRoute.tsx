
import React, { useEffect, useState } from "react";
import { SmokeTestDashboard } from "@/components/testing/SmokeTestDashboard";
import { RoleAwareLayout } from "@/components/layout/RoleAwareLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertTriangle, BarChart } from "lucide-react";
import { useSmokeTest, SmokeTestResult } from "@/hooks/useSmokeTest";
import { Button } from "@/components/ui/button";
import { useValidatedNavigation } from "@/hooks/useValidatedNavigation";
import { canAccessTestingRoute, isDevelopmentEnvironment, getRoutePerformanceMetrics } from "@/utils/navigation/routeValidation";
import { toast } from "sonner";
import { useRoleAwareErrorHandling } from "@/utils/errorHandling";
import { getErrorBoundaryAnalytics } from "@/components/errors/ErrorBoundary";

/**
 * Analytics dashboard component showing test metrics
 */
const TestAnalytics = () => {
  const [metrics, setMetrics] = useState<Record<string, { averageLoadTime: number, errorRate: number, trafficVolume: number }>>({});
  const [errorData, setErrorData] = useState<any[]>([]);
  
  // Fetch metrics data
  useEffect(() => {
    const routeMetrics = getRoutePerformanceMetrics();
    setMetrics(routeMetrics);
    
    const errorMetrics = getErrorBoundaryAnalytics();
    setErrorData(errorMetrics);
  }, []);
  
  if (Object.keys(metrics).length === 0 && errorData.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-500">No analytics data available yet.</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 border rounded-md mb-4">
      <div className="flex items-center mb-4">
        <BarChart className="mr-2 h-5 w-5 text-blue-600" />
        <h3 className="font-medium">Test Analytics</h3>
      </div>
      
      {Object.keys(metrics).length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Route Performance</h4>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(metrics).map(([route, data]) => (
              <div key={route} className="p-2 border rounded-md">
                <div className="text-xs font-medium">{route}</div>
                <div className="text-xs">Load time: {data.averageLoadTime}ms</div>
                <div className="text-xs">Error rate: {(data.errorRate * 100).toFixed(1)}%</div>
                <div className="text-xs">Traffic: {data.trafficVolume} visits</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {errorData.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Recent Errors ({errorData.length})</h4>
          <div className="max-h-40 overflow-y-auto">
            {errorData.map((error, i) => (
              <div key={i} className="p-2 mb-1 border rounded-md text-xs">
                <div><b>{error.componentName}</b>: {error.errorMessage}</div>
                <div>Recovered: {error.wasRecovered ? 'Yes' : 'No'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Route component for the smoke test dashboard with role-based access control
 */
const SmokeTestRoute = () => {
  const { role, isLoading } = useAuth();
  const { navigateTo } = useValidatedNavigation();
  const isAdmin = role === "admin";
  const isDevelopment = isDevelopmentEnvironment();
  const { handleRoleAwareError } = useRoleAwareErrorHandling();
  const [testResults, setTestResults] = useState<SmokeTestResult[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Log access attempts for security auditing
  useEffect(() => {
    console.log(`Smoke Test Route accessed by user with role: ${role || "unauthenticated"}`);
    
    // Check if user can access this route
    if (!canAccessTestingRoute("/testing/smoke", role)) {
      toast.error("Access Denied", {
        description: "You don't have permission to access the smoke test dashboard.",
      });
    }
    
    // Track page view for analytics
    console.info(`[Analytics] Smoke Test Dashboard viewed by ${role || "unauthenticated"} user`);
    
    // This would send to an analytics service in production
    // analytics.pageView("/testing/smoke", { userRole: role });
  }, [role]);
  
  // Run smoke test for this component
  const { testFeature } = useSmokeTest("SmokeTestRoute", [], {
    category: "routes",
    context: { role, isDevelopment }
  });
  
  // Test that analytics toggle works
  useEffect(() => {
    testFeature("analyticsToggle", () => {
      if (showAnalytics) {
        // Component is already initialized
        return;
      }
      
      // Test toggling analytics
      setShowAnalytics(true);
      if (!showAnalytics) {
        throw new Error("Failed to set analytics state");
      }
    });
  }, [testFeature, showAnalytics]);
  
  // Handle test run completion
  const handleTestRunComplete = (results: SmokeTestResult[]) => {
    setTestResults(results);
    
    // Track analytics
    console.info(`[Analytics] Test run completed: ${results.length} tests run, ${
      results.filter(r => r.passed).length
    } passed, ${
      results.filter(r => !r.passed).length
    } failed`);
    
    try {
      // This would typically send to an analytics service
      if (results.some(r => !r.passed)) {
        handleRoleAwareError(
          new Error(`${results.filter(r => !r.passed).length} tests failed`),
          "SmokeTestRoute.handleTestRunComplete"
        );
      }
    } catch (error) {
      console.error("Failed to handle test results:", error);
    }
  };
  
  if (isLoading) {
    return (
      <RoleAwareLayout role={role} showRoleNavigation={false}>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse">Loading...</div>
        </div>
      </RoleAwareLayout>
    );
  }
  
  // Non-admin users in production see restricted access view
  if (!isAdmin && !isDevelopment) {
    return (
      <RoleAwareLayout role={role} showRoleNavigation={false}>
        <div className="container mx-auto py-8">
          <Alert variant="destructive" className="mb-6">
            <Shield className="h-4 w-4 mr-2" />
            <AlertTitle>Restricted Access</AlertTitle>
            <AlertDescription>
              The Smoke Test Dashboard is only accessible to administrators.
            </AlertDescription>
          </Alert>
          
          <div className="text-center mt-10">
            <Button onClick={() => navigateTo("/")}>
              Return to Home
            </Button>
          </div>
        </div>
      </RoleAwareLayout>
    );
  }
  
  // Non-admin users in development see warning banner but can access
  const showDevWarning = !isAdmin && isDevelopment;
  
  return (
    <RoleAwareLayout role={role} showRoleNavigation={false}>
      {showDevWarning && (
        <Alert variant="default" className="mb-2 mx-auto max-w-6xl mt-4 border-yellow-400 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
          <AlertTitle>Development Mode</AlertTitle>
          <AlertDescription>
            You're accessing the Smoke Test Dashboard in development mode. In production, 
            this would be restricted to administrators only.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="container mx-auto py-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Smoke Test Dashboard</h1>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            <BarChart className="h-4 w-4 mr-2" />
            {showAnalytics ? "Hide Analytics" : "Show Analytics"}
          </Button>
        </div>
        
        {showAnalytics && <TestAnalytics />}
        
        <SmokeTestDashboard onTestRunComplete={handleTestRunComplete} />
        
        {testResults.length > 0 && (
          <div className="mt-4 p-4 border rounded-md">
            <h3 className="font-medium mb-2">Latest Test Run Results</h3>
            <div className="text-sm">
              {testResults.length} tests run, {testResults.filter(r => r.passed).length} passed, {
                testResults.filter(r => !r.passed).length
              } failed
            </div>
          </div>
        )}
      </div>
    </RoleAwareLayout>
  );
};

export default SmokeTestRoute;
