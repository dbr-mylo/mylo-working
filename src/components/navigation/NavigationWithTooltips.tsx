
import React from "react";
import { useLocation } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useIsWriter, useIsDesigner, useIsAdmin } from "@/utils/roles";
import { useSmokeTest } from "@/hooks/useSmokeTest";
import { 
  commonNavItems, 
  writerNavItems, 
  designerNavItems, 
  adminNavItems,
  testingNavItems
} from "./navigationConfig";
import { NavItemConfig } from "./NavigationGroup";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Add interface for component props
interface RoleNavigationWithTooltipsProps {
  navigateTo: (path: string, options?: { replace?: boolean; state?: any }) => void;
  tooltipSide?: "top" | "right" | "bottom" | "left";
}

export const RoleNavigationWithTooltips: React.FC<RoleNavigationWithTooltipsProps> = ({ 
  navigateTo,
  tooltipSide = "right" 
}) => {
  const { role } = useAuth();
  const location = useLocation();
  useSmokeTest("RoleNavigationWithTooltips");
  
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
  
  const renderItems = (items: NavItemConfig[]) => {
    return items.map((item) => (
      <NavigationMenuItem key={item.href}>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button 
              variant={isActive(item.href) ? "default" : "ghost"} 
              size="icon"
              onClick={() => handleNavigation(item.href)}
              className="h-9 w-9"
            >
              {item.icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={tooltipSide}>
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>
      </NavigationMenuItem>
    ));
  };
  
  return (
    <NavigationMenu className="max-w-none w-full justify-start py-1">
      <NavigationMenuList className="space-x-1 flex-col space-y-2 items-start">
        {renderItems(commonNavItems)}
        {isWriter && renderItems(writerNavItems)}
        {isDesigner && renderItems(designerNavItems)}
        {isAdmin && (
          <>
            {renderItems(adminNavItems)}
            {renderItems(testingNavItems)}
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
