
import React, { useEffect } from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { usePreferences } from "@/contexts/preferences/PreferencesContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ThemeToggleProps {
  variant?: "icon" | "switch" | "toggle" | "radio";
  showTooltip?: boolean;
  size?: "sm" | "md" | "lg";
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = "icon",
  showTooltip = true,
  size = "md",
}) => {
  const { preferences, updatePreference, isDarkMode, isSystemTheme } = usePreferences();

  const toggleTheme = () => {
    if (isSystemTheme) {
      const newTheme = isDarkMode ? "light" : "dark";
      updatePreference("theme", newTheme);
      return;
    }

    const newTheme = isDarkMode ? "light" : "dark";
    updatePreference("theme", newTheme);
  };

  const setSystemTheme = () => {
    updatePreference("theme", "system");
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
      case "radio":
        return (
          <RadioGroup
            value={preferences.theme}
            onValueChange={(value: "light" | "dark" | "system") => updatePreference("theme", value)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light" className="flex items-center">
                <Sun className={`${iconSizes[size]} mr-2`} />
                Light
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark" className="flex items-center">
                <Moon className={`${iconSizes[size]} mr-2`} />
                Dark
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system" className="flex items-center">
                <Laptop className={`${iconSizes[size]} mr-2`} />
                System
              </Label>
            </div>
          </RadioGroup>
        );
      case "switch":
        return (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Switch 
                checked={isDarkMode} 
                onCheckedChange={toggleTheme}
                aria-label="Toggle theme"
              />
              <span className="text-sm">{isDarkMode ? "Dark" : "Light"}</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Switch 
                checked={isSystemTheme} 
                onCheckedChange={() => isSystemTheme ? updatePreference("theme", isDarkMode ? "dark" : "light") : setSystemTheme()}
                aria-label="Use system theme"
              />
              <span className="text-sm">System preference</span>
            </div>
          </div>
        );
      case "toggle":
        return (
          <div className="flex flex-col space-y-2">
            <Toggle 
              pressed={isDarkMode} 
              onPressedChange={toggleTheme}
              aria-label="Toggle theme"
              className="bg-transparent border justify-start w-full"
            >
              {isDarkMode ? <Moon className={iconSizes[size]} /> : <Sun className={iconSizes[size]} />}
              <span className="ml-2">{isDarkMode ? "Dark" : "Light"}</span>
            </Toggle>
            <Toggle 
              pressed={isSystemTheme} 
              onPressedChange={() => isSystemTheme ? updatePreference("theme", isDarkMode ? "dark" : "light") : setSystemTheme()}
              aria-label="Use system theme"
              className="bg-transparent border justify-start w-full"
            >
              <Laptop className={iconSizes[size]} />
              <span className="ml-2">System preference</span>
            </Toggle>
          </div>
        );
      case "icon":
      default:
        return (
          <div className="flex items-center">
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
            {isSystemTheme && (
              <div className="text-xs text-muted-foreground ml-1">System</div>
            )}
          </div>
        );
    }
  };

  if (showTooltip && variant !== 'radio') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {renderToggleContent()}
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isSystemTheme 
                ? "Following system preference" 
                : `Switch to ${isDarkMode ? "light" : "dark"} mode`}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return renderToggleContent();
};
