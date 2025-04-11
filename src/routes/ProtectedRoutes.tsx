
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/utils/roles";
import { useSmokeTest } from "@/hooks/useSmokeTest";
import { DesignerRoute as DesignerRouteGuard, WriterRoute as WriterRouteGuard } from "@/components/routes/ProtectedRoutes";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, role } = useAuth();
  useSmokeTest("ProtectedRoute");
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user && !role) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdmin = useIsAdmin();
  const { user, isLoading } = useAuth();
  useSmokeTest("AdminRoute");
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  useSmokeTest("AuthRoute");
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (user) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// Re-export the existing role-based route guards
export const DesignerRoute = DesignerRouteGuard;
export const WriterRoute = WriterRouteGuard;
