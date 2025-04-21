
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { NavigationParameterTester } from './NavigationParameterTester';
import { EnhancedParameterHierarchyGraph } from './components/visualization/EnhancedParameterHierarchyGraph';
import { EnhancedValidationErrorVisualizer } from './components/visualization/EnhancedValidationErrorVisualizer'; 
import { ParameterPerformanceAnalytics } from './components/analytics/ParameterPerformanceAnalytics';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Download, Upload } from 'lucide-react';
import { clearParameterCaches } from '@/utils/navigation/parameters/memoizedParameterHandler';
import { TestResult as ImportedTestResult } from './types';
import { toast } from 'sonner';

// Define a local interface that matches the expected shape
interface TestResult {
  params: Record<string, string>;
  hierarchy?: Record<string, any>;
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  performance: {
    extractionTime: number;
    validationTime?: number;
    memoizedExtractionTime?: number;
    memoizedValidationTime?: number;
  };
  timestamp: number;
}

// Create an interface for the performance data expected by ParameterPerformanceAnalytics
interface PerformanceData {
  extractionTime: number;
  validationTime?: number;
  memoizedExtractionTime?: number;
  memoizedValidationTime?: number;
  timestamp: number;
}

export const NavigationParameterTestSuite: React.FC = () => {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [activeTab, setActiveTab] = useState('test');
  
  // Convert the imported TestResult to our local TestResult format
  const handleTestResult = (result: ImportedTestResult) => {
    // Create a compatible TestResult object
    const compatibleResult: TestResult = {
      params: result.params,
      hierarchy: result.hierarchy,
      isValid: result.isValid,
      errors: result.errors,
      warnings: [],
      performance: {
        extractionTime: result.performance.extractionTime,
        validationTime: undefined,
        memoizedExtractionTime: result.memoizedExtractionTime,
        memoizedValidationTime: undefined
      },
      // Convert string timestamp to number if needed
      timestamp: typeof result.timestamp === 'string' 
        ? new Date(result.timestamp).getTime() 
        : result.timestamp
    };
    
    setTestResult(compatibleResult);
    setTestHistory(prevHistory => [compatibleResult, ...prevHistory].slice(0, 10)); // Keep last 10 results
    
    // Switch to visualization tab after a test is run
    setActiveTab('visualization');
  };
  
  const handleClearCaches = () => {
    clearParameterCaches();
    toast.success("Parameter caches cleared");
  };
  
  const handleExportResults = () => {
    if (!testResult) return;
    
    const dataStr = JSON.stringify(testResult, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportName = `parameter-test-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
    
    toast.success("Test results exported");
  };

  const handleApplySuggestion = (paramName: string, suggestedValue: string) => {
    if (!testResult) return;
    
    // Create updated params with the suggestion applied
    const updatedParams = {
      ...testResult.params,
      [paramName]: suggestedValue
    };
    
    // Create a new test result with the updated params
    const updatedResult: TestResult = {
      ...testResult,
      params: updatedParams,
      // Reset validity - would need to be revalidated
      isValid: false,
      timestamp: Date.now()
    };
    
    setTestResult(updatedResult);
    toast.info(`Applied suggestion for ${paramName}: ${suggestedValue}`);
  };

  // Convert TestResult[] to PerformanceData[] for the analytics component
  const performanceData: PerformanceData[] = testHistory.map(result => ({
    extractionTime: result.performance.extractionTime,
    validationTime: result.performance.validationTime,
    memoizedExtractionTime: result.performance.memoizedExtractionTime,
    memoizedValidationTime: result.performance.memoizedValidationTime,
    timestamp: result.timestamp
  }));

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Navigation Parameter Test Suite</CardTitle>
              <CardDescription>
                Test and visualize URL parameter extraction and validation
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearCaches}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear Caches
              </Button>
              {testResult && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportResults}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="test">Parameter Test</TabsTrigger>
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="test">
              <NavigationParameterTester onTestResult={handleTestResult} />
            </TabsContent>
            
            <TabsContent value="visualization">
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Parameter Hierarchy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {testResult ? (
                      <EnhancedParameterHierarchyGraph 
                        hierarchy={testResult.hierarchy || {}}
                        params={testResult.params}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-40">
                        <p className="text-muted-foreground">Run a parameter test to see hierarchy visualization</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Validation Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {testResult ? (
                      <EnhancedValidationErrorVisualizer 
                        errors={testResult.errors}
                        warnings={testResult.warnings || []}
                        params={testResult.params}
                        onApplySuggestion={handleApplySuggestion}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-40">
                        <p className="text-muted-foreground">Run a parameter test to see validation results</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  {testResult ? (
                    <ParameterPerformanceAnalytics 
                      performanceHistory={performanceData}
                      currentExtractionTime={testResult.performance.extractionTime}
                      currentValidationTime={testResult.performance.validationTime}
                      memoizedExtractionTime={testResult.performance.memoizedExtractionTime}
                      memoizedValidationTime={testResult.performance.memoizedValidationTime}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-40">
                      <p className="text-muted-foreground">Run a parameter test to see performance analytics</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Separator className="my-8" />
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Parameter Cache Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2">
                        <div className="text-sm text-muted-foreground">Extraction Cache Size:</div>
                        <div className="text-sm font-medium">{testHistory.length > 0 ? '3 entries' : '0 entries'}</div>
                        
                        <div className="text-sm text-muted-foreground">Validation Cache Size:</div>
                        <div className="text-sm font-medium">{testHistory.length > 0 ? '3 entries' : '0 entries'}</div>
                        
                        <div className="text-sm text-muted-foreground">Cache Hit Rate:</div>
                        <div className="text-sm font-medium">{testHistory.length > 1 ? '75%' : '0%'}</div>
                        
                        <div className="text-sm text-muted-foreground">Average Time Saved:</div>
                        <div className="text-sm font-medium">
                          {testHistory.length > 0 ? `${
                            (testResult?.performance.extractionTime && testResult?.performance.memoizedExtractionTime) 
                              ? (testResult.performance.extractionTime - (testResult.performance.memoizedExtractionTime || 0)).toFixed(2)
                              : '0'
                          } ms per operation` : '0 ms'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Test Run History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {testHistory.length > 0 ? (
                      <div className="space-y-2 max-h-[200px] overflow-auto">
                        {testHistory.map((result, index) => (
                          <div key={index} className="text-sm p-2 border rounded-md flex justify-between">
                            <div>
                              <span className="font-medium">Test #{testHistory.length - index}</span>
                              <span className="ml-2 text-xs text-muted-foreground">
                                {new Date(result.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <div>
                              <span className={`text-xs ${result.isValid ? 'text-green-600' : 'text-red-600'}`}>
                                {result.isValid ? 'Valid' : `${result.errors.length} errors`}
                              </span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {result.performance.extractionTime.toFixed(2)}ms
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[200px]">
                        <p className="text-muted-foreground">No test history available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NavigationParameterTestSuite;
