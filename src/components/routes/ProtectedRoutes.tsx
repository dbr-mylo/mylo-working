
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

// Role-specific route wrapper for Designer-only routes
export const DesignerRoute = ({ children }: { children: React.ReactNode }) => {
  const { role, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  if (role !== "designer" && role !== "admin") {
    return <UnauthorizedAccess role={role} routePath={location.pathname} requiredRole="designer" />;
  }
  
  return <>{children}</>;
};

// Role-specific route wrapper for Writer-only routes
export const WriterRoute = ({ children }: { children: React.ReactNode }) => {
  const { role, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  if (role !== "writer" && role !== "admin") {
    return <UnauthorizedAccess role={role} routePath={location.pathname} requiredRole="writer" />;
  }
  
  return <>{children}</>;
};

// Component to display when a user tries to access a route they don't have permission for
export const UnauthorizedAccess = ({ 
  role, 
  routePath, 
  requiredRole 
}: { 
  role: string | null; 
  routePath: string;
  requiredRole: string;
}) => {
  const defaultRedirectPath = role === "designer" ? "/editor" : "/";
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8">
      <Alert variant="destructive" className="max-w-md mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You don't have permission to access this page. This page requires the {requiredRole} role.
          {role && <span> Your current role is {role}.</span>}
        </AlertDescription>
      </Alert>
      
      <div className="flex gap-4">
        <Button asChild variant="default">
          <a href={defaultRedirectPath}>Go to Dashboard</a>
        </Button>
      </div>
    </div>
  );
};
