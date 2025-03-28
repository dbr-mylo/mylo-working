
import React from "react";
import { SmokeTestDashboard } from "@/components/testing/SmokeTestDashboard";
import { RoleAwareLayout } from "@/components/layout/RoleAwareLayout";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";
import { useSmokeTestRoute } from "@/hooks/useSmokeTestRoute";
import { TestAnalytics } from "@/components/testing/analytics/TestAnalytics";
import { AccessControl } from "@/components/testing/access/AccessControl";
import { SmokeTestResults } from "@/components/testing/SmokeTestResults";

/**
 * Route component for the smoke test dashboard with role-based access control
 */
const SmokeTestRoute = () => {
  const {
    role,
    isAdmin,
    isDevelopment,
    isLoading,
    testResults,
    showAnalytics,
    setShowAnalytics,
    handleTestRunComplete
  } = useSmokeTestRoute();
  
  if (isLoading) {
    return (
      <RoleAwareLayout role={role} showRoleNavigation={false}>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse">Loading...</div>
        </div>
      </RoleAwareLayout>
    );
  }
  
  return (
    <RoleAwareLayout role={role} showRoleNavigation={false}>
      <AccessControl isAdmin={isAdmin} isDevelopment={isDevelopment} role={role}>
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
          
          <SmokeTestResults testResults={testResults} />
        </div>
      </AccessControl>
    </RoleAwareLayout>
  );
};

export default SmokeTestRoute;
