
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getAllErrorCategoryInfo, getRecentErrors } from '@/utils/error/selfHealingSystem';
import { useSessionRecovery } from '@/hooks/useSessionRecovery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowUpRight, CheckCircle, Clock, RefreshCw, XCircle } from 'lucide-react';
import { useRoleAwareErrorHandling } from '@/hooks/useErrorHandling';
import { ErrorCategory } from '@/utils/error/errorClassifier';

/**
 * Dashboard for displaying recovery metrics and error statistics
 */
export function RecoveryMetricsDashboard() {
  const { metrics } = useSessionRecovery();
  const { getCategoryErrorInfo } = useRoleAwareErrorHandling();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [errorCategories, setErrorCategories] = useState(getAllErrorCategoryInfo());
  const [recentErrors, setRecentErrors] = useState(getRecentErrors(10));
  
  // Refresh data periodically
  useEffect(() => {
    const refreshData = () => {
      setErrorCategories(getAllErrorCategoryInfo());
      setRecentErrors(getRecentErrors(10));
    };
    
    // Initial load
    refreshData();
    
    // Set up refresh interval
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // Calculate overall recovery success rate
  const overallSuccessRate = metrics?.totalAttempts 
    ? (metrics.successfulAttempts / metrics.totalAttempts) * 100 
    : 0;
  
  // Get top error categories
  const topErrorCategories = Object.values(errorCategories)
    .sort((a, b) => b.occurrences - a.occurrences)
    .slice(0, 5);
  
  // Get categories by recovery rate
  const categoriesByRecoveryRate = Object.values(errorCategories)
    .filter(cat => cat.recoveryAttempts > 0)
    .sort((a, b) => b.recoveryRate - a.recoveryRate);

  // Function to get appropriate color for recovery rate
  const getRecoveryRateColor = (rate: number): string => {
    if (rate >= 0.8) return "text-green-600";
    if (rate >= 0.5) return "text-amber-600";
    return "text-red-600";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Recovery Metrics</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setErrorCategories(getAllErrorCategoryInfo());
            setRecentErrors(getRecentErrors(undefined, 10));
          }}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Recovery Attempts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalAttempts || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Lifetime recovery attempts
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Successful Recoveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.successfulAttempts || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Successfully recovered errors
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallSuccessRate.toFixed(1)}%
            </div>
            <Progress 
              value={overallSuccessRate} 
              className="h-1 mt-2" 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Recovery Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.averageRecoveryTimeMs 
                ? `${(metrics.averageRecoveryTimeMs / 1000).toFixed(1)}s` 
                : 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Average time to recover
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed metrics */}
      <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="w-full">
          <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
          <TabsTrigger value="errors" className="flex-1">Recent Errors</TabsTrigger>
          <TabsTrigger value="categories" className="flex-1">Error Categories</TabsTrigger>
          <TabsTrigger value="performance" className="flex-1">Performance</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Distribution by Category</CardTitle>
              <CardDescription>
                Breakdown of errors by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topErrorCategories.length > 0 ? (
                <div className="space-y-4">
                  {topErrorCategories.map((category) => (
                    <div key={category.category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{category.category}</span>
                        <span className="text-muted-foreground">{category.occurrences} occurrences</span>
                      </div>
                      <Progress 
                        value={(category.occurrences / (topErrorCategories[0]?.occurrences || 1)) * 100} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <AlertCircle className="mx-auto h-12 w-12 opacity-30" />
                  <p className="mt-2">No error data collected yet</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recovery Effectiveness</CardTitle>
              <CardDescription>
                Success rate by error category
              </CardDescription>
            </CardHeader>
            <CardContent>
              {categoriesByRecoveryRate.length > 0 ? (
                <div className="space-y-3">
                  {categoriesByRecoveryRate.map((category) => (
                    <div key={category.category} className="flex justify-between items-center">
                      <div className="flex-1">
                        <span className="font-medium">{category.category}</span>
                        <Progress 
                          value={category.recoveryRate * 100} 
                          className="h-2 mt-1" 
                        />
                      </div>
                      <span className={`ml-4 ${getRecoveryRateColor(category.recoveryRate)}`}>
                        {(category.recoveryRate * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <Clock className="mx-auto h-12 w-12 opacity-30" />
                  <p className="mt-2">No recovery attempts recorded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Recent Errors Tab */}
        <TabsContent value="errors" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Errors</CardTitle>
              <CardDescription>
                Most recent errors across all categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentErrors.length > 0 ? (
                <div className="space-y-4">
                  {recentErrors.map((error, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge variant={error.recoverySucceeded ? "default" : "destructive"}>
                            {error.category}
                          </Badge>
                          <p className="mt-2 text-sm font-medium">{error.message}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(error.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Context: {error.context}</span>
                        {error.recoveryAttempted && (
                          <span className="flex items-center">
                            {error.recoverySucceeded ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                                <span className="text-green-600">Recovery succeeded</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1 text-red-600" />
                                <span className="text-red-600">Recovery failed</span>
                              </>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <CheckCircle className="mx-auto h-12 w-12 opacity-30" />
                  <p className="mt-2">No recent errors recorded</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Error Categories Tab */}
        <TabsContent value="categories" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Categories</CardTitle>
              <CardDescription>
                Detailed metrics for each error category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-4 text-left font-medium">Category</th>
                      <th className="h-10 px-4 text-right font-medium">Occurrences</th>
                      <th className="h-10 px-4 text-right font-medium">Recovery Attempts</th>
                      <th className="h-10 px-4 text-right font-medium">Success Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errorCategories.map((category) => (
                      <tr key={category.category} className="border-b">
                        <td className="p-4 align-middle font-medium">
                          {category.category}
                        </td>
                        <td className="p-4 align-middle text-right">
                          {category.occurrences}
                        </td>
                        <td className="p-4 align-middle text-right">
                          {category.recoveryAttempted}
                        </td>
                        <td className="p-4 align-middle text-right">
                          <span className={getRecoveryRateColor(category.recoveryRate)}>
                            {(category.recoveryRate * 100).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Performance Tab */}
        <TabsContent value="performance" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Recovery Time Trends</CardTitle>
              <CardDescription>
                Average recovery time over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <ArrowUpRight className="h-12 w-12 mx-auto opacity-30" />
                  <p className="mt-2">Chart would display here with actual data</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Session Recovery Stats</CardTitle>
              <CardDescription>
                Authentication service performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-y-2">
                <div className="text-sm text-muted-foreground">Total attempts:</div>
                <div className="text-sm text-right">{metrics?.totalAttempts || 0}</div>
                
                <div className="text-sm text-muted-foreground">Successful:</div>
                <div className="text-sm text-right">{metrics?.successfulAttempts || 0}</div>
                
                <div className="text-sm text-muted-foreground">Failed:</div>
                <div className="text-sm text-right">{(metrics?.totalAttempts || 0) - (metrics?.successfulAttempts || 0)}</div>
                
                <div className="text-sm text-muted-foreground">Success rate:</div>
                <div className="text-sm text-right font-medium">
                  {overallSuccessRate.toFixed(1)}%
                </div>
                
                <div className="text-sm text-muted-foreground">Average time:</div>
                <div className="text-sm text-right">
                  {metrics?.averageRecoveryTimeMs 
                    ? `${(metrics.averageRecoveryTimeMs / 1000).toFixed(2)}s` 
                    : 'N/A'}
                </div>
                
                <div className="text-sm text-muted-foreground">Last attempt:</div>
                <div className="text-sm text-right">
                  {metrics?.lastAttemptTimestamp 
                    ? new Date(metrics.lastAttemptTimestamp).toLocaleString() 
                    : 'Never'}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
