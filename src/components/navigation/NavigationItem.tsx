
import React from "react";
import { NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouteValidation } from "@/hooks/navigation/useRouteValidation";
import { useAuth } from "@/contexts/AuthContext";
import { doesRouteExist } from "@/utils/navigation/routeValidator";

interface NavigationItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: (path: string) => void;
  showTooltipIfInvalid?: boolean;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  href,
  label,
  icon,
  isActive,
  onClick,
  showTooltipIfInvalid = true
}) => {
  const { validateRoute } = useRouteValidation();
  const { role } = useAuth();
  
  // Check if route exists in configuration and is valid for role
  const routeExists = doesRouteExist(href);
  const isValidForRole = validateRoute(href);
  
  // Determine if this is a missing route vs. a permission issue
  const isMissingRoute = !routeExists;
  const isPermissionIssue = routeExists && !isValidForRole;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isMissingRoute) {
      console.warn(`Navigation attempted to undefined route: ${href}`);
    }
    
    onClick(href);
  };
  
  // If the route doesn't exist or is invalid and tooltips are enabled
  if ((isMissingRoute || isPermissionIssue) && showTooltipIfInvalid) {
    const tooltipMessage = isMissingRoute 
      ? "This route is not defined in the application"
      : "This feature requires additional permissions";
      
    return (
      <TooltipProvider>
        <NavigationMenuItem>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavigationMenuLink 
                className={`${navigationMenuTriggerStyle()} cursor-not-allowed opacity-50`}
                onClick={(e) => e.preventDefault()}
              >
                <span className="flex items-center">
                  {icon}
                  {label}
                </span>
              </NavigationMenuLink>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltipMessage}</p>
            </TooltipContent>
          </Tooltip>
        </NavigationMenuItem>
      </TooltipProvider>
    );
  }
  
  // Regular navigation item
  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        className={navigationMenuTriggerStyle() + (isActive ? " bg-accent" : "")}
        onClick={handleClick}
      >
        <span className="flex items-center">
          {icon}
          {label}
        </span>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

export interface NavItemConfig {
  href: string;
  label: string;
  icon: React.ReactNode;
}
