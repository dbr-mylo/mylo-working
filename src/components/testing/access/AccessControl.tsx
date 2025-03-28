
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useValidatedNavigation } from "@/hooks/useValidatedNavigation";

interface AccessControlProps {
  isAdmin: boolean;
  isDevelopment: boolean;
  role: string | null;
}

/**
 * Component to handle access control for the smoke test dashboard
 */
export const AccessControl: React.FC<AccessControlProps & { children: React.ReactNode }> = ({
  isAdmin,
  isDevelopment,
  role,
  children
}) => {
  const { navigateTo } = useValidatedNavigation();
  
  // Non-admin users in production see restricted access view
  if (!isAdmin && !isDevelopment) {
    return (
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
    );
  }
  
  // For non-admin users in development, show warning banner
  return (
    <>
      {!isAdmin && isDevelopment && (
        <Alert variant="default" className="mb-2 mx-auto max-w-6xl mt-4 border-yellow-400 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
          <AlertTitle>Development Mode</AlertTitle>
          <AlertDescription>
            You're accessing the Smoke Test Dashboard in development mode. In production, 
            this would be restricted to administrators only.
          </AlertDescription>
        </Alert>
      )}
      {children}
    </>
  );
};
