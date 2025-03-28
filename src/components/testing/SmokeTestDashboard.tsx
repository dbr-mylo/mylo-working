
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/errors";
import { useAuth } from "@/contexts/AuthContext";
import { isDevelopmentEnvironment } from "@/utils/navigation/routeValidation";
import { SmokeTestDashboardProps } from "./SmokeTestDashboardProps";
import {
  DashboardHeader,
  DashboardStats,
  DashboardControls,
  AccessAlert,
  ErrorTestComponent,
  TestResultsTable,
  DashboardFooter,
  useDashboardState
} from "./dashboard";

/**
 * Dashboard for running smoke tests with role-based UI adaptations
 */
export const SmokeTestDashboard: React.FC<SmokeTestDashboardProps> = ({ onTestRunComplete }) => {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const isDevelopment = isDevelopmentEnvironment();
  
  // Use the custom hook to manage dashboard state
  const {
    results,
    showErrorTest,
    testEnabled,
    summary,
    toggleTests,
    clearResults,
    runErrorTest,
    runAllTests
  } = useDashboardState(onTestRunComplete);
  
  // Determine if certain actions should be restricted based on role
  const canRunDestructiveTests = isAdmin || isDevelopment;
  
  return (
    <ErrorBoundary context="SmokeTestDashboard">
      <div className="container mx-auto py-8 space-y-6">
        <Card>
          <CardHeader>
            <DashboardHeader role={role} />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <DashboardStats summary={summary} />
              <DashboardControls 
                testEnabled={testEnabled}
                toggleTests={toggleTests}
                clearResults={clearResults}
                runErrorTest={runErrorTest}
                runAllTests={runAllTests}
                canRunDestructiveTests={canRunDestructiveTests}
              />
            </div>
            
            <AccessAlert isAdmin={isAdmin} isDevelopment={isDevelopment} />
            <ErrorTestComponent showErrorTest={showErrorTest} />
            
            <TestResultsTable results={results} />
          </CardContent>
          <CardFooter>
            <DashboardFooter isDevelopment={isDevelopment} />
          </CardFooter>
        </Card>
      </div>
    </ErrorBoundary>
  );
};
