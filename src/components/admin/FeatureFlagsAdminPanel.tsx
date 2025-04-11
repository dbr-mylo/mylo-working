
import React, { useState, useEffect, useMemo } from 'react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CirclePlus, Save, RefreshCw, Search, Info, BarChart, History, Clock, Flag } from "lucide-react";
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
import { DonutChart } from "@/components/ui/donut-chart";
import { getSystemHealthStatus } from '@/utils/featureFlags/systemHealth';
import { Highlight } from "@/components/ui/highlight";
import { useFeatureFlagHistory } from '@/hooks/useFeatureFlagHistory';
import { FeatureFlagHistoryEntry, FeatureFlagUsageStats } from '@/utils/featureFlags/types';

/**
 * Admin panel for managing feature flags
 */
export function FeatureFlagsAdminPanel() {
  const { flags, isEnabled, setOverride } = useFeatureFlags();
  const { role } = useAuth();
  const { history, logFlagChange } = useFeatureFlagHistory();
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({});
  const [newFlagName, setNewFlagName] = useState('');
  const [isAddingFlag, setIsAddingFlag] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all-flags');
  const [roleVisibility, setRoleVisibility] = useState<Record<string, RoleVisibility>>({});
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [usageData, setUsageData] = useState<Record<string, FeatureFlagUsageStats>>({});
  const systemHealthStatus = getSystemHealthStatus();
  
  useEffect(() => {
    loadFeatureFlags();
    initializeRoleVisibility();
    fetchUsageStatistics();
  }, [role]);
  
  const loadFeatureFlags = () => {
    const allFlags = getAllFeatureFlags(role);
    setFeatureFlags(allFlags);
  };
  
  const fetchUsageStatistics = () => {
    // In a real app, this would fetch from an API
    // For now, using mock data with some real flags
    const mockUsageData: Record<string, FeatureFlagUsageStats> = {};
    
    Object.keys(getAllFeatureFlags()).forEach(flag => {
      mockUsageData[flag] = {
        name: flag,
        impressions: Math.floor(Math.random() * 15000) + 1000,
        usageRate: Math.random() * 0.9 + 0.1,
        byRole: {
          admin: Math.floor(Math.random() * 1000) + 100,
          writer: Math.floor(Math.random() * 4000) + 500,
          designer: Math.floor(Math.random() * 3000) + 500,
          guest: Math.floor(Math.random() * 2000) + 100
        },
        healthImpact: Math.random() * 30
      };
    });
    
    setUsageData(mockUsageData);
  };
  
  const initializeRoleVisibility = () => {
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
    
    setFeatureFlags(prev => ({
      ...prev,
      [flag]: enabled
    }));
    
    // Log the change to history
    logFlagChange({
      flagName: flag as FeatureFlagKey,
      newValue: enabled,
      timestamp: Date.now(),
      changedBy: role || 'unknown',
      previousValue: !enabled
    });
    
    toast.success(`Feature "${flag}" ${enabled ? 'enabled' : 'disabled'}`);
  };
  
  const handleResetFlag = (flag: string) => {
    clearFeatureOverride(flag as FeatureFlagKey);
    
    loadFeatureFlags();
    
    // Log the reset to history
    logFlagChange({
      flagName: flag as FeatureFlagKey,
      newValue: null,
      timestamp: Date.now(),
      changedBy: role || 'unknown',
      previousValue: featureFlags[flag],
      action: 'reset'
    });
    
    toast.info(`Feature "${flag}" reset to default`);
  };
  
  const handleResetAllFlags = () => {
    resetAllOverrides();
    
    // Log all resets
    Object.entries(featureFlags).forEach(([flag, value]) => {
      logFlagChange({
        flagName: flag as FeatureFlagKey,
        newValue: null,
        timestamp: Date.now(),
        changedBy: role || 'unknown',
        previousValue: value,
        action: 'reset'
      });
    });
    
    loadFeatureFlags();
    
    toast.info('All features reset to defaults');
  };
  
  const handleAddFlag = () => {
    if (!newFlagName.trim()) {
      toast.error('Please enter a flag name');
      return;
    }
    
    const normalizedName = newFlagName.trim();
    if (!/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(normalizedName)) {
      toast.error('Flag name can only contain letters, numbers, hyphens and underscores');
      return;
    }
    
    if (featureFlags.hasOwnProperty(normalizedName)) {
      toast.error('Flag already exists');
      return;
    }
    
    setRoleVisibility(prev => ({
      ...prev,
      [normalizedName]: {
        admin: true,
        writer: true,
        designer: true,
        guest: true
      }
    }));
    
    setFeatureFlags(prev => ({
      ...prev,
      [normalizedName]: false
    }));
    
    // Log the addition to history
    logFlagChange({
      flagName: normalizedName as FeatureFlagKey,
      newValue: false,
      timestamp: Date.now(),
      changedBy: role || 'unknown',
      previousValue: null,
      action: 'create'
    });
    
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
    
    logFlagChange({
      flagName: flag as FeatureFlagKey,
      newValue: null,
      timestamp: Date.now(),
      changedBy: role || 'unknown',
      previousValue: null,
      action: 'visibility-change',
      metadata: { role, visible }
    });
    
    toast.success(`${role} ${visible ? 'can now see' : 'cannot see'} "${flag}"`);
  };
  
  const filteredFlags = useMemo(() => {
    let result = Object.entries(featureFlags);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(([flag]) => 
        flag.toLowerCase().includes(query) || 
        getFlagDescription(flag as FeatureFlagKey).toLowerCase().includes(query)
      );
    }
    
    if (selectedTab === 'critical-flags') {
      const criticalFlags = getCriticalFeatures();
      result = result.filter(([flag]) => criticalFlags.includes(flag as FeatureFlagKey));
    } else if (selectedTab === 'non-critical-flags') {
      const nonCriticalFlags = getNonCriticalFeatures();
      result = result.filter(([flag]) => nonCriticalFlags.includes(flag as FeatureFlagKey));
    }
    
    if (selectedRole !== 'all') {
      result = result.filter(([flag]) => {
        const visibility = roleVisibility[flag];
        return visibility && visibility[selectedRole as keyof RoleVisibility];
      });
    }
    
    return result;
  }, [featureFlags, searchQuery, selectedTab, selectedRole, roleVisibility]);

  const getUsageChartData = () => {
    return Object.entries(usageData).slice(0, 5).map(([flag, data]) => ({
      name: flag,
      value: data.impressions,
      color: getColorForUsageRate(data.usageRate)
    }));
  };
  
  const getRoleChartData = () => {
    const roleData: Record<string, number> = { admin: 0, writer: 0, designer: 0, guest: 0 };
    
    Object.values(usageData).forEach(data => {
      Object.entries(data.byRole).forEach(([role, count]) => {
        roleData[role] = (roleData[role] || 0) + count;
      });
    });
    
    return Object.entries(roleData).map(([role, value]) => ({
      name: role,
      value,
      color: getRoleColor(role)
    }));
  };
  
  const getColorForUsageRate = (rate: number): string => {
    if (rate > 0.7) return '#3b82f6'; // blue
    if (rate > 0.3) return '#10b981'; // green
    return '#6b7280'; // gray
  };
  
  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'admin': return '#ef4444'; // red
      case 'writer': return '#3b82f6'; // blue
      case 'designer': return '#8b5cf6'; // purple
      default: return '#6b7280'; // gray
    }
  };
  
  const getHealthStatusColor = () => {
    switch (systemHealthStatus) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Feature Flags</h2>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-muted-foreground">System health:</span>
            <Badge variant="outline" className={getHealthStatusColor()}>
              {systemHealthStatus.charAt(0).toUpperCase() + systemHealthStatus.slice(1)}
            </Badge>
          </div>
        </div>
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
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all-flags">All Flags</TabsTrigger>
          <TabsTrigger value="critical-flags">Critical</TabsTrigger>
          <TabsTrigger value="non-critical-flags">Non-Critical</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-flags">
          <FlagsList 
            flags={filteredFlags} 
            handleFlagToggle={handleFlagToggle}
            handleResetFlag={handleResetFlag}
            roleVisibility={roleVisibility}
            handleRoleVisibilityChange={handleRoleVisibilityChange}
            searchQuery={searchQuery}
          />
        </TabsContent>
        
        <TabsContent value="critical-flags">
          <FlagsList 
            flags={filteredFlags}
            handleFlagToggle={handleFlagToggle}
            handleResetFlag={handleResetFlag}
            roleVisibility={roleVisibility}
            handleRoleVisibilityChange={handleRoleVisibilityChange}
            searchQuery={searchQuery}
          />
        </TabsContent>
        
        <TabsContent value="non-critical-flags">
          <FlagsList 
            flags={filteredFlags}
            handleFlagToggle={handleFlagToggle}
            handleResetFlag={handleResetFlag}
            roleVisibility={roleVisibility}
            handleRoleVisibilityChange={handleRoleVisibilityChange}
            searchQuery={searchQuery}
          />
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flag Change History</CardTitle>
              <CardDescription>
                Recent changes to feature flags and their configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FeatureFlagHistory history={history} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="usage-stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Feature Usage</CardTitle>
                <CardDescription>
                  Usage statistics across top features
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <DonutChart data={getUsageChartData()} />
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
                  <DonutChart data={getRoleChartData()} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <FeatureUsageTable usageData={usageData} />
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

/**
 * Role visibility settings for feature flags
 */
interface RoleVisibility {
  admin: boolean;
  writer: boolean;
  designer: boolean;
  guest: boolean;
}

function FlagsList({ 
  flags, 
  handleFlagToggle, 
  handleResetFlag,
  roleVisibility,
  handleRoleVisibilityChange,
  searchQuery
}: { 
  flags: [string, boolean][];
  handleFlagToggle: (flag: string, enabled: boolean) => void;
  handleResetFlag: (flag: string) => void;
  roleVisibility: Record<string, RoleVisibility>;
  handleRoleVisibilityChange: (flag: string, role: keyof RoleVisibility, visible: boolean) => void;
  searchQuery: string;
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
                <CardTitle className="text-lg">
                  {searchQuery ? (
                    <Highlight text={flag} highlight={searchQuery} />
                  ) : (
                    flag
                  )}
                </CardTitle>
                <CardDescription className="text-sm">
                  {searchQuery ? (
                    <Highlight 
                      text={getFlagDescription(flag as FeatureFlagKey)} 
                      highlight={searchQuery} 
                    />
                  ) : (
                    getFlagDescription(flag as FeatureFlagKey)
                  )}
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

function FeatureFlagHistory({ history }: { history: FeatureFlagHistoryEntry[] }) {
  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <History className="w-12 h-12 mx-auto text-muted-foreground" />
        <h3 className="mt-2 text-lg font-medium">No history yet</h3>
        <p className="text-muted-foreground">
          Changes to feature flags will appear here
        </p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="h-10 px-4 text-left font-medium">Timestamp</th>
            <th className="h-10 px-4 text-left font-medium">Flag</th>
            <th className="h-10 px-4 text-left font-medium">Change</th>
            <th className="h-10 px-4 text-left font-medium">By</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, index) => (
            <tr key={index} className="border-b">
              <td className="p-4 align-middle">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  {new Date(entry.timestamp).toLocaleString()}
                </div>
              </td>
              <td className="p-4 align-middle font-medium">{entry.flagName}</td>
              <td className="p-4 align-middle">
                {entry.action === 'create' ? (
                  <Badge variant="outline" className="bg-green-50">Created</Badge>
                ) : entry.action === 'reset' ? (
                  <Badge variant="outline" className="bg-blue-50">Reset to default</Badge>
                ) : entry.action === 'visibility-change' ? (
                  <Badge variant="outline" className="bg-purple-50">Visibility changed</Badge>
                ) : (
                  <Badge variant={entry.newValue ? "default" : "secondary"}>
                    {entry.previousValue?.toString() || 'Default'} → {entry.newValue?.toString() || 'Default'}
                  </Badge>
                )}
              </td>
              <td className="p-4 align-middle">{entry.changedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FeatureUsageTable({ usageData }: { usageData: Record<string, FeatureFlagUsageStats> }) {
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
                <th className="h-10 px-4 text-right font-medium">Health Impact</th>
                <th className="h-10 px-4 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(usageData).map(([flag, data]) => (
                <tr key={flag} className="border-b">
                  <td className="p-4 align-middle font-medium">{flag}</td>
                  <td className="p-4 align-middle text-right">{data.impressions.toLocaleString()}</td>
                  <td className="p-4 align-middle text-right">{(data.usageRate * 100).toFixed(1)}%</td>
                  <td className="p-4 align-middle text-right">{data.healthImpact.toFixed(1)}%</td>
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
