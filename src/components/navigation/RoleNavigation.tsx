
import React from "react";
import { useLocation } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WriterOnly, DesignerOnly, AdminOnly } from "@/utils/roles/RoleComponents";
import { useIsWriter, useIsDesigner, useIsAdmin } from "@/utils/roles";
import { 
  FileText, 
  Pencil, 
  Layout, 
  Settings, 
  Box, 
  TestTube2, 
  Home, 
  Clock, 
  FileCode, 
  FolderOpen, 
  Activity,
  BarChart
} from "lucide-react";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";
import { useSmokeTest } from "@/hooks/useSmokeTest";

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
  
  // Define navigation items based on roles
  const commonNavItems = [
    { href: "/", label: "Dashboard", icon: <Home className="h-4 w-4 mr-2" /> },
    { href: "/documents", label: "Documents", icon: <FileText className="h-4 w-4 mr-2" /> },
  ];
  
  const writerNavItems = [
    { href: "/editor", label: "Editor", icon: <Pencil className="h-4 w-4 mr-2" /> },
    { href: "/content/drafts", label: "Drafts", icon: <Box className="h-4 w-4 mr-2" /> },
    { href: "/templates", label: "Templates", icon: <FileCode className="h-4 w-4 mr-2" /> }
  ];
  
  const designerNavItems = [
    { href: "/templates", label: "Templates", icon: <FileCode className="h-4 w-4 mr-2" /> },
    { href: "/design/layout", label: "Layout", icon: <Layout className="h-4 w-4 mr-2" /> },
    { href: "/design/design-settings", label: "Design Settings", icon: <Settings className="h-4 w-4 mr-2" /> }
  ];
  
  const adminNavItems = [
    { href: "/admin", label: "Admin Dashboard", icon: <Settings className="h-4 w-4 mr-2" /> },
    { href: "/admin/system-health", label: "System Health", icon: <Activity className="h-4 w-4 mr-2" /> },
    { href: "/admin/recovery-metrics", label: "Recovery Metrics", icon: <BarChart className="h-4 w-4 mr-2" /> }
  ];
  
  const testingNavItems = [
    { href: "/testing/regression", label: "Regression Tests", icon: <TestTube2 className="h-4 w-4 mr-2" /> },
    { href: "/testing/smoke", label: "Smoke Tests", icon: <TestTube2 className="h-4 w-4 mr-2" /> }
  ];
  
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
        {commonNavItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + (isActive(item.href) ? " bg-accent" : "")}
              onClick={() => handleNavigation(item.href)}
            >
              <span className="flex items-center">
                {item.icon}
                {item.label}
              </span>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
        
        {/* Writer-specific navigation */}
        {isWriter && (
          <>
            {writerNavItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle() + (isActive(item.href) ? " bg-accent" : "")}
                  onClick={() => handleNavigation(item.href)}
                >
                  <span className="flex items-center">
                    {item.icon}
                    {item.label}
                  </span>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </>
        )}
        
        {/* Designer-specific navigation */}
        {isDesigner && (
          <>
            {designerNavItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle() + (isActive(item.href) ? " bg-accent" : "")}
                  onClick={() => handleNavigation(item.href)}
                >
                  <span className="flex items-center">
                    {item.icon}
                    {item.label}
                  </span>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </>
        )}
        
        {/* Admin-specific navigation */}
        {isAdmin && (
          <>
            {adminNavItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle() + (isActive(item.href) ? " bg-accent" : "")}
                  onClick={() => handleNavigation(item.href)}
                >
                  <span className="flex items-center">
                    {item.icon}
                    {item.label}
                  </span>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            
            {/* Testing section for admins */}
            {testingNavItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle() + (isActive(item.href) ? " bg-accent" : "")}
                  onClick={() => handleNavigation(item.href)}
                >
                  <span className="flex items-center">
                    {item.icon}
                    {item.label}
                  </span>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

// Navigation with tooltips for disabled actions
export const RoleNavigationWithTooltips = () => {
  const { role } = useAuth();
  
  return (
    <ErrorBoundary context="RoleNavigationWithTooltips">
      <TooltipProvider>
        <div className="flex items-center space-x-4">
          {/* Example of a writer trying to access designer features */}
          {role === "writer" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="text-gray-400 cursor-not-allowed p-2 rounded-md"
                  disabled
                >
                  <Layout className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Design features are only available for Designer role</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          <RoleNavigation navigateTo={() => {}} />
        </div>
      </TooltipProvider>
    </ErrorBoundary>
  );
};
