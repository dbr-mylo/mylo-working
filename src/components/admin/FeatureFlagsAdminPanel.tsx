
import React, { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CirclePlus, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { 
  FeatureFlagKey,
  getAllFeatureFlags,
  setFeatureOverride,
  clearFeatureOverride,
  resetAllOverrides
} from '@/utils/featureFlags/featureFlags';
import { useAuth } from '@/contexts/AuthContext';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

/**
 * Admin panel for managing feature flags
 */
export function FeatureFlagsAdminPanel() {
  const { flags, isEnabled, setOverride } = useFeatureFlags();
  const { role } = useAuth();
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({});
  const [newFlagName, setNewFlagName] = useState('');
  const [isAddingFlag, setIsAddingFlag] = useState(false);
  
  useEffect(() => {
    loadFeatureFlags();
  }, [role]);
  
  const loadFeatureFlags = () => {
    const allFlags = getAllFeatureFlags(role);
    setFeatureFlags(allFlags);
  };
  
  const handleFlagToggle = (flag: string, enabled: boolean) => {
    setOverride(flag as FeatureFlagKey, enabled);
    
    // Update local state
    setFeatureFlags(prev => ({
      ...prev,
      [flag]: enabled
    }));
    
    toast.success(`Feature "${flag}" ${enabled ? 'enabled' : 'disabled'}`);
  };
  
  const handleResetFlag = (flag: string) => {
    setOverride(flag as FeatureFlagKey, null);
    
    // Refresh flags
    loadFeatureFlags();
    
    toast.info(`Feature "${flag}" reset to default`);
  };
  
  const handleResetAllFlags = () => {
    resetAllOverrides();
    loadFeatureFlags();
    
    toast.info('All features reset to defaults');
  };
  
  const handleAddFlag = () => {
    if (!newFlagName.trim()) {
      toast.error('Please enter a flag name');
      return;
    }
    
    // Simple validation for flag name
    const normalizedName = newFlagName.trim();
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(normalizedName)) {
      toast.error('Flag name can only contain letters, numbers, and underscores');
      return;
    }
    
    // Check for existing flag
    if (featureFlags.hasOwnProperty(normalizedName)) {
      toast.error('Flag already exists');
      return;
    }
    
    // In a real implementation, this would add the flag to the feature flags system
    // For now, we'll just add it to our local state
    setFeatureFlags(prev => ({
      ...prev,
      [normalizedName]: false
    }));
    
    setNewFlagName('');
    setIsAddingFlag(false);
    
    toast.success(`New feature flag "${normalizedName}" created`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Feature Flags</h2>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => loadFeatureFlags()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleResetAllFlags}
          >
            Reset All
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => setIsAddingFlag(true)}
          >
            <CirclePlus className="w-4 h-4 mr-2" />
            Add Flag
          </Button>
        </div>
      </div>
      
      {isAddingFlag && (
        <Card className="border-2 border-dashed border-primary/20 bg-muted/20">
          <CardHeader>
            <CardTitle>Add New Feature Flag</CardTitle>
            <CardDescription>
              Create a new feature flag to control feature availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="flag-name">Flag Name</Label>
                <Input 
                  id="flag-name" 
                  value={newFlagName} 
                  onChange={(e) => setNewFlagName(e.target.value)}
                  placeholder="new_feature_flag"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setIsAddingFlag(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddFlag}>
              <Save className="w-4 h-4 mr-2" />
              Create Flag
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid gap-4">
        {Object.entries(featureFlags).map(([flag, enabled]) => (
          <Card key={flag}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">{flag}</CardTitle>
                  <CardDescription className="text-sm">
                    {getFlagDescription(flag as FeatureFlagKey)}
                  </CardDescription>
                </div>
                <Badge variant={enabled ? "default" : "secondary"}>
                  {enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor={`flag-${flag}`}>
                  {enabled ? "Enabled" : "Disabled"}
                </Label>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleResetFlag(flag)}
                  >
                    Reset
                  </Button>
                  <Switch
                    id={`flag-${flag}`}
                    checked={enabled}
                    onCheckedChange={(checked) => handleFlagToggle(flag, checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Helper function to provide descriptions for known feature flags
function getFlagDescription(flag: FeatureFlagKey): string {
  const descriptions: Record<string, string> = {
    'advanced_formatting': 'Enable advanced text formatting options',
    'templates': 'Enable template management features',
    'realtime_collaboration': 'Enable real-time collaborative editing',
    'export_formats': 'Enable additional document export formats',
    'dark_theme': 'Enable dark theme support',
    'auto_recovery': 'Enable automatic document recovery features',
    'offline_mode': 'Enable offline editing capabilities',
    'advanced_search': 'Enable advanced document search features'
  };
  
  return descriptions[flag] || 'No description available';
}
