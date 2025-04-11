
import React from "react";
import { NavigationItem, NavItemConfig } from "./NavigationItem";
import { useRouteValidation } from "@/hooks/navigation/useRouteValidation";

interface NavigationGroupProps {
  items: NavItemConfig[];
  isActive: (path: string) => boolean;
  onNavigate: (path: string) => void;
  showTooltipsForInvalidRoutes?: boolean;
}

export const NavigationGroup: React.FC<NavigationGroupProps> = ({
  items,
  isActive,
  onNavigate,
  showTooltipsForInvalidRoutes = true
}) => {
  const { validateRoute } = useRouteValidation();
  
  return (
    <>
      {items.map((item) => (
        <NavigationItem
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          isActive={isActive(item.href)}
          onClick={onNavigate}
          showTooltipIfInvalid={showTooltipsForInvalidRoutes}
        />
      ))}
    </>
  );
};
