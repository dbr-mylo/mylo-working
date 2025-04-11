
import React from "react";
import { useLocation } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useIsWriter, useIsDesigner, useIsAdmin } from "@/utils/roles";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";
import { useSmokeTest } from "@/hooks/useSmokeTest";
import { NavigationGroup } from "./NavigationGroup";
import { 
  commonNavItems, 
  writerNavItems, 
  designerNavItems, 
  adminNavItems,
  testingNavItems
} from "./navigationConfig";

// Add interface for component props
interface RoleNavigationProps {
  navigateTo: (path: string, options?: { replace?: boolean; state?: any }) => void;
}

export const RoleNavigation: React.FC<RoleNavigationProps> = ({ navigateTo }) => {
  const { role } = useAuth();
  const location = useLocation();
  useSmokeTest("RoleNavigation");
  
  // Use the role hooks for consistent role checking
  const isWriter = useIsWriter();
  const isDesigner = useIsDesigner();
  const isAdmin = useIsAdmin();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleNavigation = (path: string) => {
    navigateTo(path);
  };
  
  return (
    <NavigationMenu className="max-w-none w-full justify-start py-1">
      <NavigationMenuList className="space-x-1">
        {/* Common navigation items for all roles */}
        <NavigationGroup 
          items={commonNavItems} 
          isActive={isActive} 
          onNavigate={handleNavigation} 
        />
        
        {/* Writer-specific navigation */}
        {isWriter && (
          <NavigationGroup 
            items={writerNavItems} 
            isActive={isActive} 
            onNavigate={handleNavigation} 
          />
        )}
        
        {/* Designer-specific navigation */}
        {isDesigner && (
          <NavigationGroup 
            items={designerNavItems} 
            isActive={isActive} 
            onNavigate={handleNavigation} 
          />
        )}
        
        {/* Admin-specific navigation */}
        {isAdmin && (
          <>
            <NavigationGroup 
              items={adminNavItems} 
              isActive={isActive} 
              onNavigate={handleNavigation} 
            />
            
            {/* Testing section for admins */}
            <NavigationGroup 
              items={testingNavItems} 
              isActive={isActive} 
              onNavigate={handleNavigation} 
            />
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

// Re-export the tooltip component for backward compatibility
export { RoleNavigationWithTooltips } from "./NavigationWithTooltips";
