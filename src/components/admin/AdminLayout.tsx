
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { useAuth } from "@/contexts/AuthContext";
import { useRouteValidation } from "@/hooks/navigation/useRouteValidation";
import { ErrorBoundary } from "@/components/errors";

/**
 * Admin Layout component that provides consistent structure for admin pages
 * with enhanced route validation
 */
export const AdminLayout = () => {
  const location = useLocation();
  const { role } = useAuth();
  const { validateRoute } = useRouteValidation();
  
  // Validate the current route
  React.useEffect(() => {
    if (!validateRoute(location.pathname)) {
      console.warn(`User with role ${role} attempting to access invalid route: ${location.pathname}`);
    }
  }, [location.pathname, role, validateRoute]);

  return (
    <div className="flex h-screen">
      <ErrorBoundary context="AdminSidebar">
        <AdminSidebar />
      </ErrorBoundary>
      <main className="flex-1 overflow-auto bg-background">
        <ErrorBoundary context={`AdminPage:${location.pathname}`}>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
};

