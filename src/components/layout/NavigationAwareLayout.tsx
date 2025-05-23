
import React, { useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { RoleAwareLayout } from "./RoleAwareLayout";
import { NavigationBreadcrumb } from "@/components/navigation/NavigationBreadcrumb";
import { useAuth } from "@/contexts/AuthContext";
import { navigationService } from "@/services/navigation/NavigationService";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";

interface NavigationAwareLayoutProps {
  children?: React.ReactNode;
  showBreadcrumbs?: boolean;
  breadcrumbMaxItems?: number;
  showHomeIcon?: boolean;
}

/**
 * Layout component that adds navigation-aware features like breadcrumbs
 * and handles role-based routing
 */
export const NavigationAwareLayout: React.FC<NavigationAwareLayoutProps> = ({ 
  children,
  showBreadcrumbs = true,
  breadcrumbMaxItems = 4,
  showHomeIcon = true
}) => {
  const { role, previousRole } = useAuth();
  const location = useLocation();
  const { navigateTo } = useNavigationHandlers();
  
  // Handle role transitions
  useEffect(() => {
    if (role !== previousRole) {
      try {
        const destinationRoute = navigationService.handleRoleTransition(previousRole, role);
        
        // If a destination route is returned and we need to redirect
        if (destinationRoute && navigationService.needsRedirect(location.pathname, role)) {
          navigateTo(destinationRoute);
        }
      } catch (error) {
        console.error("Navigation error during role transition:", error);
        // Fallback to a safe route if something goes wrong
        if (role) {
          const fallbackRoute = navigationService.getFallbackRoute(role);
          if (fallbackRoute) {
            navigateTo(fallbackRoute);
          }
        }
      }
    }
  }, [role, previousRole, location.pathname, navigateTo]);
  
  const isAuthRoute = location.pathname === "/auth";
  
  return (
    <div className="flex flex-col min-h-screen">
      {showBreadcrumbs && !isAuthRoute && (
        <NavigationBreadcrumb 
          maxItems={breadcrumbMaxItems} 
          showHomeIcon={showHomeIcon} 
        />
      )}
      
      <RoleAwareLayout role={role}>
        {children || <Outlet />}
      </RoleAwareLayout>
    </div>
  );
};

export default NavigationAwareLayout;
