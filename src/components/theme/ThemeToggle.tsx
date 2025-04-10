
import React from "react";
import { Moon, Sun } from "lucide-react";
import { usePreferences } from "@/contexts/preferences/PreferencesContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";

interface ThemeToggleProps {
  variant?: "icon" | "switch" | "toggle";
  showTooltip?: boolean;
  size?: "sm" | "md" | "lg";
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = "icon",
  showTooltip = true,
  size = "md",
}) => {
  const { preferences, updatePreference, isDarkMode } = usePreferences();

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    updatePreference("theme", newTheme);
  };

  const buttonSizes = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-10 w-10",
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const renderToggleContent = () => {
    switch (variant) {
      case "switch":
        return (
          <div className="flex items-center space-x-2">
            <Switch 
              checked={isDarkMode} 
              onCheckedChange={toggleTheme}
              aria-label="Toggle theme"
            />
            <span className="text-sm">{isDarkMode ? "Dark" : "Light"}</span>
          </div>
        );
      case "toggle":
        return (
          <Toggle 
            pressed={isDarkMode} 
            onPressedChange={toggleTheme}
            aria-label="Toggle theme"
            className="bg-transparent border"
          >
            {isDarkMode ? <Moon className={iconSizes[size]} /> : <Sun className={iconSizes[size]} />}
            <span className="ml-2">{isDarkMode ? "Dark" : "Light"}</span>
          </Toggle>
        );
      case "icon":
      default:
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={buttonSizes[size]}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Moon className={iconSizes[size]} />
            ) : (
              <Sun className={iconSizes[size]} />
            )}
          </Button>
        );
    }
  };

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {renderToggleContent()}
          </TooltipTrigger>
          <TooltipContent>
            <p>Switch to {isDarkMode ? "light" : "dark"} mode</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return renderToggleContent();
};
