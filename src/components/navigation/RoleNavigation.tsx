
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { FileText, Pencil, Layout, Settings, Box } from "lucide-react";

export const RoleNavigation = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use the role hooks for consistent role checking
  const isWriter = useIsWriter();
  const isDesigner = useIsDesigner();
  const isAdmin = useIsAdmin();
  
  // Define navigation items based on roles
  const writerNavItems = [
    { href: "/editor", label: "Editor", icon: <Pencil className="h-4 w-4 mr-2" /> },
    { href: "/content/documents", label: "Documents", icon: <FileText className="h-4 w-4 mr-2" /> },
    { href: "/content/drafts", label: "Drafts", icon: <Box className="h-4 w-4 mr-2" /> }
  ];
  
  const designerNavItems = [
    { href: "/design/templates", label: "Templates", icon: <FileText className="h-4 w-4 mr-2" /> },
    { href: "/design/layout", label: "Layout", icon: <Layout className="h-4 w-4 mr-2" /> },
    { href: "/design/design-settings", label: "Settings", icon: <Settings className="h-4 w-4 mr-2" /> }
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <NavigationMenu className="max-w-none w-full justify-start p-2">
      <NavigationMenuList className="space-x-2">
        {/* Common navigation items for all roles */}
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle() + (isActive("/") ? " bg-accent" : "")}
            onClick={() => navigate("/")}
          >
            Dashboard
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        {/* Writer-specific navigation */}
        {isWriter && (
          <>
            {writerNavItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle() + (isActive(item.href) ? " bg-accent" : "")}
                  onClick={() => navigate(item.href)}
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
                  onClick={() => navigate(item.href)}
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
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + (isActive("/admin") ? " bg-accent" : "")}
              onClick={() => navigate("/admin")}
            >
              Admin Panel
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

// Navigation with tooltips for disabled actions
export const RoleNavigationWithTooltips = () => {
  const { role } = useAuth();
  
  return (
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
        
        <RoleNavigation />
      </div>
    </TooltipProvider>
  );
};
