
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { canAccessTestingRoute, isDevelopmentEnvironment } from "@/utils/navigation/routeValidation";
import { useRoleAwareErrorHandling } from "@/utils/errorHandling";
import { useSmokeTest, SmokeTestResult } from "@/hooks/useSmokeTest";
import { toast } from "sonner";

export const useSmokeTestRoute = () => {
  const { role, isLoading } = useAuth();
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
  
  return {
    role,
    isAdmin,
    isDevelopment,
    isLoading,
    testResults,
    showAnalytics,
    setShowAnalytics,
    handleTestRunComplete
  };
};
