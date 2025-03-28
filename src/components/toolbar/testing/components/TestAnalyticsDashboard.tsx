
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { BarChart, PieChart, Layers, Clock, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TestResult } from '../hooks/useToolbarTestResult';
import { TestResultsChart } from './TestResultsChart';
import { TestPerformanceMetrics } from './TestPerformanceMetrics';

interface TestAnalyticsDashboardProps {
  testResults: Record<string, TestResult>;
  lastRunTime: string | null;
  runDuration?: number;
  onRunTests: () => void;
  onResetTests: () => void;
}

export const TestAnalyticsDashboard: React.FC<TestAnalyticsDashboardProps> = ({
  testResults,
  lastRunTime,
  runDuration,
  onRunTests,
  onResetTests
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate test statistics
  const totalTests = Object.keys(testResults).length;
  const passedTests = Object.values(testResults).filter(r => r.passed).length;
  const failedTests = totalTests - passedTests;
  const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
  
  // Group test results by category
  const testsByCategory = Object.entries(testResults).reduce((acc, [id, result]) => {
    const category = id.split('.')[0] || 'unknown';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(result);
    return acc;
  }, {} as Record<string, TestResult[]>);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Editor Test Analytics</CardTitle>
            <CardDescription>
              Performance and reliability metrics for document editing operations
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={onResetTests}>
              Reset Tests
            </Button>
            <Button size="sm" onClick={onRunTests}>
              Run Tests
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-muted/50 p-4 rounded-lg flex flex-col items-center justify-center">
            <div className="text-3xl font-bold">{totalTests}</div>
            <div className="text-sm text-muted-foreground">Total Tests</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-green-600">{passedTests}</div>
            <div className="text-sm text-green-600">Passed</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-red-600">{failedTests}</div>
            <div className="text-sm text-red-600">Failed</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-blue-600">{passRate}%</div>
            <div className="text-sm text-blue-600">Pass Rate</div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">
              <BarChart className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="categories">
              <Layers className="h-4 w-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="performance">
              <Clock className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="errors">
              <AlertCircle className="h-4 w-4 mr-2" />
              Errors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <TestResultsChart testResults={testResults} />
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Test Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {runDuration ? `${runDuration}ms` : 'N/A'}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Last Run</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg">
                    {lastRunTime 
                      ? new Date(lastRunTime).toLocaleTimeString() 
                      : 'Never'}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="space-y-4">
              {Object.entries(testsByCategory).map(([category, tests]) => {
                const categoryPassedTests = tests.filter(t => t.passed).length;
                const categoryPassRate = Math.round((categoryPassedTests / tests.length) * 100);
                
                return (
                  <div key={category} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium capitalize">{category}</div>
                      <Badge 
                        variant={categoryPassRate === 100 ? "outline" : "secondary"}
                        className={categoryPassRate === 100 
                          ? "border-green-500 text-green-500" 
                          : ""}
                      >
                        {categoryPassRate}% Pass Rate
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tests.length} tests, {categoryPassedTests} passed, {tests.length - categoryPassedTests} failed
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <TestPerformanceMetrics testResults={testResults} />
          </TabsContent>

          <TabsContent value="errors">
            <div className="space-y-4">
              {Object.entries(testResults)
                .filter(([_, result]) => !result.passed)
                .map(([id, result]) => (
                  <div key={id} className="border-l-4 border-red-500 pl-4 py-2">
                    <div className="font-medium">{result.name || id}</div>
                    <div className="text-sm text-muted-foreground">{result.message}</div>
                    {result.details && (
                      <div className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                        <code>{result.details}</code>
                      </div>
                    )}
                  </div>
                ))}
              {!Object.values(testResults).some(r => !r.passed) && (
                <div className="text-center p-4 text-muted-foreground">
                  No errors found in the last test run.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      {lastRunTime && (
        <CardFooter className="text-xs text-muted-foreground border-t px-6 py-4">
          Last test run: {new Date(lastRunTime).toLocaleString()}
        </CardFooter>
      )}
    </Card>
  );
};
