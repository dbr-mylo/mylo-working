
import React, { useState, useEffect, useMemo } from 'react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CirclePlus, Save, RefreshCw, Search, Info, BarChart } from "lucide-react";
import { toast } from "sonner";
import { 
  FeatureFlagKey,
  getAllFeatureFlags,
  setFeatureOverride,
  clearFeatureOverride,
  resetAllOverrides,
  getFlagDescription,
  getCriticalFeatures,
  getNonCriticalFeatures
} from '@/utils/featureFlags/featureFlags';
import { useAuth } from '@/contexts/AuthContext';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/lib/types";
import { Chart } from "react-chartjs-2";

/**
 * Flag usage statistics (typically would come from a backend)
 * This is a mock for demonstration
 */
type FlagUsageStats = {
  name: string;
  impressions: number;
  usageRate: number;
  byRole: Record<string, number>;
};

// Mock data for feature flag usage
const mockFlagUsage: Record<string, FlagUsageStats> = {
  'core-editing': {
    name: 'core-editing',
    impressions: 14580,
    usageRate: 0.98,
    byRole: { 'admin': 350, 'writer': 12000, 'designer': 2230 }
  },
  'document-save': {
    name: 'document-save',
    impressions: 8920,
    usageRate: 0.95,
    byRole: { 'admin': 320, 'writer': 7500, 'designer': 1100 }
  },
  'auth-session': {
    name: 'auth-session',
    impressions: 22450,
    usageRate: 1.0,
    byRole: { 'admin': 4500, 'writer': 12000, 'designer': 5950 }
  },
  'real-time-collaboration': {
    name: 'real-time-collaboration',
    impressions: 6340,
    usageRate: 0.72,
    byRole: { 'admin': 1200, 'writer': 3800, 'designer': 1340 }
  },
  'template-marketplace': {
    name: 'template-marketplace',
    impressions: 5280,
    usageRate: 0.62,
    byRole: { 'admin': 480, 'writer': 1100, 'designer': 3700 }
  },
  'auto_recovery': {
    name: 'auto_recovery',
    impressions: 1850,
    usageRate: 0.25,
    byRole: { 'admin': 450, 'writer': 700, 'designer': 700 }
  }
};

/**
 * Role visibility settings for feature flags
 */
interface RoleVisibility {
  admin: boolean;
  writer: boolean;
  designer: boolean;
  guest: boolean;
}

/**
 * Admin panel for managing feature flags
 */
export function FeatureFlagsAdminPanel() {
  const { flags, isEnabled, setOverride } = useFeatureFlags();
  const { role } = useAuth();
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({});
  const [newFlagName, setNewFlagName] = useState('');
  const [isAddingFlag, setIsAddingFlag] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all-flags');
  const [roleVisibility, setRoleVisibility] = useState<Record<string, RoleVisibility>>({});
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  
  useEffect(() => {
    loadFeatureFlags();
    initializeRoleVisibility();
  }, [role]);
  
  const loadFeatureFlags = () => {
    const allFlags = getAllFeatureFlags(role);
    setFeatureFlags(allFlags);
  };
  
  const initializeRoleVisibility = () => {
    // Initialize default role visibility (all roles can see all flags)
    const initialRoleVisibility: Record<string, RoleVisibility> = {};
    const allFlags = getAllFeatureFlags();
    
    Object.keys(allFlags).forEach(flag => {
      initialRoleVisibility[flag] = {
        admin: true,
        writer: true,
        designer: true,
        guest: true
      };
    });
    
    // Restrict some flags to admin only as an example
    if (initialRoleVisibility['template-marketplace']) {
      initialRoleVisibility['template-marketplace'].guest = false;
    }
    
    if (initialRoleVisibility['advanced-formatting']) {
      initialRoleVisibility['advanced-formatting'].guest = false;
    }
    
    setRoleVisibility(initialRoleVisibility);
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
    clearFeatureOverride(flag as FeatureFlagKey);
    
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
    if (!/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(normalizedName)) {
      toast.error('Flag name can only contain letters, numbers, hyphens and underscores');
      return;
    }
    
    // Check for existing flag
    if (featureFlags.hasOwnProperty(normalizedName)) {
      toast.error('Flag already exists');
      return;
    }
    
    // Initialize role visibility for the new flag
    setRoleVisibility(prev => ({
      ...prev,
      [normalizedName]: {
        admin: true,
        writer: true,
        designer: true,
        guest: true
      }
    }));
    
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
  
  const handleRoleVisibilityChange = (flag: string, role: keyof RoleVisibility, visible: boolean) => {
    setRoleVisibility(prev => ({
      ...prev,
      [flag]: {
        ...prev[flag],
        [role]: visible
      }
    }));
    
    toast.success(`${role} ${visible ? 'can now see' : 'cannot see'} "${flag}"`);
  };
  
  // Filter flags based on search and selected role
  const filteredFlags = useMemo(() => {
    let result = Object.entries(featureFlags);
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(([flag]) => 
        flag.toLowerCase().includes(query) || 
        getFlagDescription(flag as FeatureFlagKey).toLowerCase().includes(query)
      );
    }
    
    // Filter by selected tab
    if (selectedTab === 'critical-flags') {
      const criticalFlags = getCriticalFeatures();
      result = result.filter(([flag]) => criticalFlags.includes(flag as FeatureFlagKey));
    } else if (selectedTab === 'non-critical-flags') {
      const nonCriticalFlags = getNonCriticalFeatures();
      result = result.filter(([flag]) => nonCriticalFlags.includes(flag as FeatureFlagKey));
    }
    
    // Filter by selected role
    if (selectedRole !== 'all') {
      result = result.filter(([flag]) => {
        const visibility = roleVisibility[flag];
        return visibility && visibility[selectedRole as keyof RoleVisibility];
      });
    }
    
    return result;
  }, [featureFlags, searchQuery, selectedTab, selectedRole, roleVisibility]);

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
      
      <div className="flex items-center space-x-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search feature flags..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={selectedRole}
          onValueChange={(value) => setSelectedRole(value as UserRole | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Roles</SelectLabel>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="writer">Writer</SelectItem>
              <SelectItem value="designer">Designer</SelectItem>
              <SelectItem value="guest">Guest</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="all-flags" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all-flags">All Flags</TabsTrigger>
          <TabsTrigger value="critical-flags">Critical</TabsTrigger>
          <TabsTrigger value="non-critical-flags">Non-Critical</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-flags">
          <FlagsList 
            flags={filteredFlags} 
            handleFlagToggle={handleFlagToggle}
            handleResetFlag={handleResetFlag}
            roleVisibility={roleVisibility}
            handleRoleVisibilityChange={handleRoleVisibilityChange}
          />
        </TabsContent>
        
        <TabsContent value="critical-flags">
          <FlagsList 
            flags={filteredFlags}
            handleFlagToggle={handleFlagToggle}
            handleResetFlag={handleResetFlag}
            roleVisibility={roleVisibility}
            handleRoleVisibilityChange={handleRoleVisibilityChange}
          />
        </TabsContent>
        
        <TabsContent value="non-critical-flags">
          <FlagsList 
            flags={filteredFlags}
            handleFlagToggle={handleFlagToggle}
            handleResetFlag={handleResetFlag}
            roleVisibility={roleVisibility}
            handleRoleVisibilityChange={handleRoleVisibilityChange}
          />
        </TabsContent>
        
        <TabsContent value="usage-stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Feature Usage</CardTitle>
                <CardDescription>
                  Usage statistics across all features
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <FeatureUsageChart />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Usage by Role</CardTitle>
                <CardDescription>
                  Feature usage breakdown by user role
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <RoleUsageChart />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <FeatureUsageTable />
        </TabsContent>
      </Tabs>
      
      {selectedTab !== 'usage-stats' && (
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => setSelectedTab('usage-stats')}
        >
          <BarChart className="w-4 h-4 mr-2" />
          View Usage Statistics
        </Button>
      )}
      
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
              <div className="space-y-2">
                <Label>Role Visibility</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['admin', 'writer', 'designer', 'guest'].map(role => (
                    <div key={role} className="flex items-center space-x-2">
                      <Switch defaultChecked id={`role-${role}`} />
                      <Label htmlFor={`role-${role}`} className="capitalize">{role}</Label>
                    </div>
                  ))}
                </div>
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
    </div>
  );
}

// Component for displaying the list of flags
function FlagsList({ 
  flags, 
  handleFlagToggle, 
  handleResetFlag,
  roleVisibility,
  handleRoleVisibilityChange
}: { 
  flags: [string, boolean][];
  handleFlagToggle: (flag: string, enabled: boolean) => void;
  handleResetFlag: (flag: string) => void;
  roleVisibility: Record<string, RoleVisibility>;
  handleRoleVisibilityChange: (flag: string, role: keyof RoleVisibility, visible: boolean) => void;
}) {
  const [expandedFlag, setExpandedFlag] = useState<string | null>(null);
  
  if (flags.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <Info className="w-12 h-12 mx-auto text-muted-foreground" />
        <h3 className="mt-2 text-lg font-medium">No feature flags found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid gap-4">
      {flags.map(([flag, enabled]) => (
        <Card key={flag} className={expandedFlag === flag ? "ring-2 ring-primary" : undefined}>
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
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-2 text-xs"
              onClick={() => setExpandedFlag(expandedFlag === flag ? null : flag)}
            >
              {expandedFlag === flag ? "Hide" : "Show"} Role Visibility Settings
            </Button>
            
            {expandedFlag === flag && roleVisibility[flag] && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Role Visibility</h4>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(roleVisibility[flag]) as Array<keyof RoleVisibility>).map((role) => (
                    <div key={`${flag}-${role}`} className="flex items-center justify-between">
                      <Label htmlFor={`flag-${flag}-${role}`} className="capitalize">
                        {role}
                      </Label>
                      <Switch
                        id={`flag-${flag}-${role}`}
                        checked={roleVisibility[flag][role]}
                        onCheckedChange={(checked) => 
                          handleRoleVisibilityChange(flag, role, checked)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Feature Usage Chart Component
function FeatureUsageChart() {
  // This would typically fetch real data from your analytics system
  // Using mock data for demonstration
  
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center text-muted-foreground">
        <BarChart className="w-12 h-12 mx-auto" />
        <p className="mt-2">Usage chart would render here with real data.</p>
        <p className="text-sm">Connect to your analytics service to view real data.</p>
      </div>
    </div>
  );
}

// Role Usage Chart Component
function RoleUsageChart() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center text-muted-foreground">
        <BarChart className="w-12 h-12 mx-auto" />
        <p className="mt-2">Role usage breakdown would render here.</p>
        <p className="text-sm">Connect to your user analytics to view role distribution.</p>
      </div>
    </div>
  );
}

// Feature Usage Table
function FeatureUsageTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Flag Metrics</CardTitle>
        <CardDescription>
          Usage statistics for all feature flags
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-10 px-4 text-left font-medium">Feature Flag</th>
                <th className="h-10 px-4 text-right font-medium">Impressions</th>
                <th className="h-10 px-4 text-right font-medium">Usage Rate</th>
                <th className="h-10 px-4 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(mockFlagUsage).map(([flag, data]) => (
                <tr key={flag} className="border-b">
                  <td className="p-4 align-middle font-medium">{flag}</td>
                  <td className="p-4 align-middle text-right">{data.impressions.toLocaleString()}</td>
                  <td className="p-4 align-middle text-right">{(data.usageRate * 100).toFixed(1)}%</td>
                  <td className="p-4 align-middle text-right">
                    <Badge variant={data.usageRate > 0.7 ? "default" : data.usageRate > 0.3 ? "outline" : "secondary"}>
                      {data.usageRate > 0.7 ? "High" : data.usageRate > 0.3 ? "Medium" : "Low"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
