
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";
import { toast } from "sonner";
import { roleAuditLogger } from "@/utils/roles/auditLogger";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRoles?: UserRole[];
  redirectTo?: string;
}

/**
 * Route that requires authentication
 */
export const AuthenticatedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/auth"
}) => {
  const { user, role, isLoading } = useAuth();
  
  // Show loading state while authentication is being checked
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // If not authenticated, redirect to auth page
  if (!user && !role) {
    toast.error("Please sign in to continue");
    
    // Log failed access attempt
    roleAuditLogger.logRoleChange({
      userId: null,
      previousRole: null,
      newRole: null,
      timestamp: Date.now(),
      source: 'system',
      success: false,
      error: 'Unauthenticated access attempt'
    });
    
    return <Navigate to={redirectTo} replace />;
  }
  
  // Render children or outlet
  return <>{children || <Outlet />}</>;
};

/**
 * Route that requires specific role(s)
 */
export const RoleProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  redirectTo = "/"
}) => {
  const { user, role, isLoading } = useAuth();
  
  // Show loading state while authentication is being checked
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // If not authenticated, redirect to auth page
  if (!user && !role) {
    toast.error("Please sign in to continue");
    return <Navigate to="/auth" replace />;
  }
  
  // Designer has elevated permissions (similar to former admin role)
  if (role === "designer") {
    return <>{children || <Outlet />}</>;
  }
  
  // If role is required but user doesn't have it, redirect
  if (requiredRoles.length > 0 && (!role || !requiredRoles.includes(role))) {
    toast.error("You don't have permission to access this page");
    
    // Log unauthorized access attempt
    roleAuditLogger.logRoleChange({
      userId: user?.id || null,
      previousRole: role,
      newRole: null,
      timestamp: Date.now(),
      source: 'system',
      success: false,
      error: `Unauthorized access attempt - Required roles: ${requiredRoles.join(', ')}`
    });
    
    return <Navigate to={redirectTo} replace />;
  }
  
  // Render children or outlet
  return <>{children || <Outlet />}</>;
};

/**
 * Route that requires designer role (replacing AdminRoute)
 */
export const DesignerRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/"
}) => {
  const { user, role, isLoading } = useAuth();
  
  // Show loading state while authentication is being checked
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // If not authenticated, redirect to auth page
  if (!user && !role) {
    toast.error("Please sign in to continue");
    return <Navigate to="/auth" replace />;
  }
  
  // If not designer, redirect
  if (role !== "designer") {
    toast.error("This page requires designer privileges");
    
    // Log unauthorized admin access attempt
    roleAuditLogger.logRoleChange({
      userId: user?.id || null,
      previousRole: role,
      newRole: null,
      timestamp: Date.now(),
      source: 'system',
      success: false,
      error: 'Unauthorized designer access attempt'
    });
    
    return <Navigate to={redirectTo} replace />;
  }
  
  // Render children or outlet
  return <>{children || <Outlet />}</>;
};
