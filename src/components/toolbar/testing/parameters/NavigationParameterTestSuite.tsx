import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NavigationParameterTester } from './NavigationParameterTester';
import { ParameterPerformanceAnalytics } from './components/analytics/ParameterPerformanceAnalytics';
import { getParameterCacheMetrics, clearParameterCaches } from '@/utils/navigation/parameters/memoizedParameterHandler';
import { getAllPerformanceHistory } from '@/utils/navigation/parameters/performanceMonitor';
import { AdvancedParameterVisualizer } from './visualization/AdvancedParameterVisualizer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from '@/components/ui/lucide-icons';

const NavigationParameterTestSuite: React.FC = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [performanceHistory, setPerformanceHistory] = useState<any[]>([]);
  const [cacheMetrics, setCacheMetrics] = useState(getParameterCacheMetrics());

  // Update performance history periodically
  useEffect(() => {
    const updateMetrics = () => {
      setPerformanceHistory(getAllPerformanceHistory());
      setCacheMetrics(getParameterCacheMetrics());
    };
    
    // Initial update
    updateMetrics();
    
    // Set up periodic updates
    const intervalId = setInterval(updateMetrics, 5000);
    
    // Cleanup
    return () => clearInterval(intervalId);
  }, []);
  
  const handleTestResultUpdate = (result: any) => {
    setTestResults(result);
    // Refresh performance data
    setPerformanceHistory(getAllPerformanceHistory());
    setCacheMetrics(getParameterCacheMetrics());
  };
  
  const handleClearCaches = () => {
    clearParameterCaches();
    setCacheMetrics(getParameterCacheMetrics());
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Navigation Parameter Test Suite</CardTitle>
          <CardDescription>
            Advanced testing and visualization tools for URL parameter extraction and validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Test Suite Information</AlertTitle>
            <AlertDescription>
              This test suite provides tools to analyze and visualize parameter extraction, 
              validation, and caching performance. Use the tabs below to access different 
              testing tools and visualizations.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <NavigationParameterTester onTestResult={handleTestResultUpdate} />
        </div>
        
        <div className="lg:col-span-2">
          <AdvancedParameterVisualizer 
            testResults={testResults}
            performanceHistory={performanceHistory}
            onClearCaches={handleClearCaches}
          />
        </div>
      </div>
    </div>
  );
};

export default NavigationParameterTestSuite;
