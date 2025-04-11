
import React from "react";
import { NavigationItem, NavItemConfig } from "./NavigationItem";

interface NavigationGroupProps {
  items: NavItemConfig[];
  isActive: (path: string) => boolean;
  onNavigate: (path: string) => void;
}

export const NavigationGroup: React.FC<NavigationGroupProps> = ({
  items,
  isActive,
  onNavigate
}) => {
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
        />
      ))}
    </>
  );
};
