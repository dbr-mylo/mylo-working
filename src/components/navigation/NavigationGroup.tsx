
import React from "react";
import { NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface NavItemConfig {
  href: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  badgeVariant?: "default" | "outline" | "secondary" | "destructive";
}

interface NavigationGroupProps {
  items: NavItemConfig[];
  isActive: (path: string) => boolean;
  onNavigate: (path: string) => void;
}

/**
 * Group of navigation items with consistent styling
 */
export const NavigationGroup: React.FC<NavigationGroupProps> = ({
  items,
  isActive,
  onNavigate
}) => {
  return (
    <>
      {items.map((item) => (
        <NavigationMenuItem key={item.href}>
          <NavigationMenuLink
            className={cn(
              navigationMenuTriggerStyle(),
              isActive(item.href) ? "bg-accent text-accent-foreground" : "bg-background",
              "cursor-pointer"
            )}
            onClick={() => onNavigate(item.href)}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge && (
              <span className={cn(
                "ml-2 rounded-full px-2 py-0.5 text-xs",
                item.badgeVariant === "outline" ? "border" : 
                item.badgeVariant === "secondary" ? "bg-secondary text-secondary-foreground" :
                item.badgeVariant === "destructive" ? "bg-destructive text-destructive-foreground" :
                "bg-primary text-primary-foreground"
              )}>
                {item.badge}
              </span>
            )}
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </>
  );
};

export default NavigationGroup;
