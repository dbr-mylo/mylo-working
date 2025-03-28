
import React, { useEffect } from "react";
import { SmokeTestDashboard } from "@/components/testing/SmokeTestDashboard";
import { RoleAwareLayout } from "@/components/layout/RoleAwareLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertTriangle } from "lucide-react";
import { useSmokeTest } from "@/hooks/useSmokeTest";
import { Button } from "@/components/ui/button";
import { useValidatedNavigation } from "@/hooks/useValidatedNavigation";
import { canAccessTestingRoute, isDevelopmentEnvironment } from "@/utils/navigation/routeValidation";
import { toast } from "sonner";

/**
 * Route component for the smoke test dashboard with role-based access control
 */
const SmokeTestRoute = () => {
  const { role, isLoading } = useAuth();
  const { navigateTo } = useValidatedNavigation();
  const isAdmin = role === "admin";
  const isDevelopment = isDevelopmentEnvironment();
  
  // Log access attempts for security auditing
  useEffect(() => {
    console.log(`Smoke Test Route accessed by user with role: ${role || "unauthenticated"}`);
    
    // Check if user can access this route
    if (!canAccessTestingRoute("/testing/smoke", role)) {
      toast.error("Access Denied", {
        description: "You don't have permission to access the smoke test dashboard.",
      });
    }
  }, [role]);
  
  useSmokeTest("SmokeTestRoute");
  
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
        <Alert variant="warning" className="mb-2 mx-auto max-w-6xl mt-4">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertTitle>Development Mode</AlertTitle>
          <AlertDescription>
            You're accessing the Smoke Test Dashboard in development mode. In production, 
            this would be restricted to administrators only.
          </AlertDescription>
        </Alert>
      )}
      <SmokeTestDashboard />
    </RoleAwareLayout>
  );
};

export default SmokeTestRoute;
