
import React from "react";
import { NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouteValidation } from "@/hooks/navigation/useRouteValidation";
import { useAuth } from "@/contexts/AuthContext";

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
  
  const isValidForRole = validateRoute(href);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick(href);
  };
  
  // If the route is invalid and tooltips are enabled, show a tooltip
  if (!isValidForRole && showTooltipIfInvalid) {
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
              <p>This feature requires additional permissions</p>
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
