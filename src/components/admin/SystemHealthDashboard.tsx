
import React, { useEffect, useState } from 'react';
import { 
  getSystemHealth, 
  getSystemHealthStatus, 
  updateStorageHealth 
} from '@/utils/featureFlags/systemHealth';
import { 
  FeatureFlagKey, 
  getAllFeatureFlags, 
  getNonCriticalFeatures,
  getCriticalFeatures, 
  setFeatureOverride 
} from '@/utils/featureFlags/featureFlags';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

/**
 * System Health Dashboard component for admin users
 * Displays system health and allows feature flag management
 */
export function SystemHealthDashboard() {
  const { role } = useAuth();
  const [health, setHealth] = useState(getSystemHealth());
  const [healthStatus, setHealthStatus] = useState(getSystemHealthStatus());
  const [flags, setFlags] = useState<Record<FeatureFlagKey, boolean>>(getAllFeatureFlags(role));
  const [refreshing, setRefreshing] = useState(false);
  
  // Update health score periodically
  useEffect(() => {
    const updateHealth = () => {
      setHealth(getSystemHealth());
      setHealthStatus(getSystemHealthStatus());
    };
    
    // Update once on mount
    updateHealth();
    
    // Update regularly
    const interval = setInterval(updateHealth, 10000);
    return () => clearInterval(interval);
  }, []);
  
  // Force a refresh of system health metrics
  const handleRefreshHealth = () => {
    setRefreshing(true);
    
    // Update storage health
    updateStorageHealth();
    
    // Update health display
    setTimeout(() => {
      setHealth(getSystemHealth());
      setHealthStatus(getSystemHealthStatus());
      setRefreshing(false);
      toast.success("System health metrics refreshed");
    }, 1000);
  };
  
  // Toggle a feature flag
  const toggleFeatureFlag = (feature: FeatureFlagKey, currentValue: boolean) => {
    setFeatureOverride(feature, !currentValue);
    setFlags(getAllFeatureFlags(role));
    
    toast.success(`Feature "${feature}" ${!currentValue ? 'enabled' : 'disabled'}`);
  };
  
  // Reset all feature flags to defaults
  const resetAllFlags = () => {
    const allFeatures = [...getCriticalFeatures(), ...getNonCriticalFeatures()];
    
    for (const feature of allFeatures) {
      setFeatureOverride(feature, null); // null removes the override
    }
    
    setFlags(getAllFeatureFlags(role));
    toast.success("All feature flags reset to defaults");
  };
  
  // Get health indicator color based on status
  const getHealthColor = () => {
    switch (healthStatus) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-amber-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Get health status text element
  const getHealthStatusElement = () => {
    switch (healthStatus) {
      case 'healthy': 
        return <div className="flex items-center text-green-600">
          <CheckCircle className="w-4 h-4 mr-1" /> Healthy
        </div>;
      case 'degraded': 
        return <div className="flex items-center text-amber-600">
          <AlertCircle className="w-4 h-4 mr-1" /> Degraded
        </div>;
      case 'critical': 
        return <div className="flex items-center text-red-600">
          <AlertCircle className="w-4 h-4 mr-1" /> Critical
        </div>;
      default: 
        return <div className="text-gray-600">Unknown</div>;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            System Health
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshHealth}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
          <CardDescription>
            Overall system health and feature availability status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-1">
              <div className="font-medium">Health Score</div>
              <div className="font-medium">{health}%</div>
            </div>
            <Progress
              value={health} 
              className={`h-2 ${getHealthColor()}`}
            />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">System Status</span>
              {getHealthStatusElement()}
            </div>
            
            {healthStatus !== 'healthy' && (
              <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Degraded System Performance</AlertTitle>
                <AlertDescription>
                  Some non-critical features may be temporarily disabled to maintain core functionality.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Feature Flag Management
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetAllFlags}
            >
              Reset All
            </Button>
          </CardTitle>
          <CardDescription>
            Enable or disable application features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Critical Features</h3>
              <div className="space-y-4">
                {getCriticalFeatures().map(feature => (
                  <div key={feature} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">{feature}</div>
                      <div className="text-xs text-muted-foreground">
                        Critical for core functionality
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge variant={flags[feature] ? "default" : "destructive"} className="mr-4">
                        {flags[feature] ? 'Enabled' : 'Disabled'}
                      </Badge>
                      <Switch
                        checked={flags[feature]}
                        onCheckedChange={() => toggleFeatureFlag(feature, flags[feature])}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-2">Non-Critical Features</h3>
              <div className="space-y-4">
                {getNonCriticalFeatures().map(feature => (
                  <div key={feature} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">{feature}</div>
                      <div className="text-xs text-muted-foreground">
                        Can be disabled during degraded operations
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge variant={flags[feature] ? "default" : "secondary"} className="mr-4">
                        {flags[feature] ? 'Enabled' : 'Disabled'}
                      </Badge>
                      <Switch
                        checked={flags[feature]}
                        onCheckedChange={() => toggleFeatureFlag(feature, flags[feature])}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <span className="text-sm text-muted-foreground">
            Changes take effect immediately
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
