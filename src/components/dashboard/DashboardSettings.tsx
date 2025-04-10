
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePreferences } from "@/contexts/preferences/PreferencesContext";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Separator } from "@/components/ui/separator";

export const DashboardSettings = () => {
  const { preferences, updatePreference } = usePreferences();

  const handleThemeChange = (value: "light" | "dark" | "system") => {
    updatePreference("theme", value);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how Mylo looks and feels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-mode">Theme Mode</Label>
              <ThemeToggle variant="toggle" showTooltip={false} />
            </div>
            
            <Separator className="my-4" />
            
            <RadioGroup 
              defaultValue={preferences.theme} 
              onValueChange={(value) => handleThemeChange(value as "light" | "dark" | "system")}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="theme-light" />
                <Label htmlFor="theme-light">Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label htmlFor="theme-dark">Dark</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="theme-system" />
                <Label htmlFor="theme-system">System</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <Label>Document View Mode</Label>
            <RadioGroup 
              defaultValue={preferences.documentViewMode} 
              onValueChange={(value) => updatePreference("documentViewMode", value as "grid" | "list")}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="grid" id="view-grid" />
                <Label htmlFor="view-grid">Grid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="list" id="view-list" />
                <Label htmlFor="view-list">List</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Editor Preferences</CardTitle>
          <CardDescription>Customize your writing experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="autosave">Autosave</Label>
            <input
              type="checkbox"
              id="autosave"
              className="toggle"
              checked={preferences.autosaveEnabled}
              onChange={(e) => updatePreference("autosaveEnabled", e.target.checked)}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <Label>Font Size</Label>
            <RadioGroup 
              defaultValue={preferences.fontSize} 
              onValueChange={(value) => updatePreference("fontSize", value as "small" | "medium" | "large")}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="font-small" />
                <Label htmlFor="font-small">Small</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="font-medium" />
                <Label htmlFor="font-medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="font-large" />
                <Label htmlFor="font-large">Large</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
