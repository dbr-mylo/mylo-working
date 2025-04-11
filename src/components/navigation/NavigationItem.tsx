
import React from "react";
import { NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { LucideIcon } from "lucide-react";

interface NavigationItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: (path: string) => void;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  href,
  label,
  icon,
  isActive,
  onClick
}) => {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        className={navigationMenuTriggerStyle() + (isActive ? " bg-accent" : "")}
        onClick={() => onClick(href)}
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
