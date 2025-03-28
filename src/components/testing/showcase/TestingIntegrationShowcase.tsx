
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, Code, BarChart, CheckCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSmokeTest } from '@/hooks/smoke-testing/useSmokeTest';
import { ExampleCounter } from './examples/ExampleCounter';
import { ExampleForm } from './examples/ExampleForm';
import { ExampleDataTable } from './examples/ExampleDataTable';
import { ExampleDocumentEditor } from './examples/ExampleDocumentEditor';
import { CodeSnippet } from './CodeSnippet';
import { TestMetricsViewer } from './TestMetricsViewer';
import { withErrorBoundary } from '@/components/errors/WithErrorBoundary';

export const TestingIntegrationShowcase = () => {
  const [activeExample, setActiveExample] = useState<string>('counter');
  const [lastRunResults, setLastRunResults] = useState<any[]>([]);
  
  // Use smoke testing on this component itself
  const { runTest, testFeature, lastTestResult } = useSmokeTest('TestingIntegrationShowcase', [], {
    category: 'showcase',
    context: { activeExample }
  });
  
  // Track when examples are changed
  const handleExampleChange = (example: string) => {
    setActiveExample(example);
    
    // Test the tab switching functionality
    testFeature('tabSwitch', () => {
      if (example !== activeExample) {
        return true;
      }
      throw new Error('Failed to update active example');
    });
  };
  
  // Collect test results from examples
  const handleTestRunComplete = (results: any[]) => {
    setLastRunResults(results);
    console.info(`Collected ${results.length} test results from example: ${activeExample}`);
  };
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Testing Integration Showcase</h1>
          <p className="text-muted-foreground mt-1">
            Examples of using testing hooks in custom components
          </p>
        </div>
        
        <Badge variant={lastTestResult?.passed ? "outline" : "destructive"} className={lastTestResult?.passed ? "border-green-500 text-green-500" : ""}>
          {lastTestResult?.passed ? "Showcase Tests Passing" : "Showcase Test Failed"}
        </Badge>
      </div>
      
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>About This Page</AlertTitle>
        <AlertDescription>
          This showcase demonstrates how to integrate testing hooks into your components.
          Each example shows a different testing strategy and includes the code to implement it.
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeExample} onValueChange={handleExampleChange} className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="counter" className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            Simple Counter
          </TabsTrigger>
          <TabsTrigger value="form" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            Form Validation
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            Data Table
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center gap-1">
            <Code className="h-4 w-4" />
            Document Editor
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <TabsContent value="counter" className="mt-0">
              <ExampleCard 
                title="Counter Component with Tests" 
                description="A simple counter component with integrated smoke tests to verify functionality"
              >
                <ExampleCounter onTestRunComplete={handleTestRunComplete} />
              </ExampleCard>
            </TabsContent>
            
            <TabsContent value="form" className="mt-0">
              <ExampleCard 
                title="Form with Validation Tests" 
                description="A form component with integrated tests for validation logic"
              >
                <ExampleForm onTestRunComplete={handleTestRunComplete} />
              </ExampleCard>
            </TabsContent>
            
            <TabsContent value="data" className="mt-0">
              <ExampleCard 
                title="Data Table with Sorting Tests" 
                description="A data table component with tests for sorting and filtering"
              >
                <ExampleDataTable onTestRunComplete={handleTestRunComplete} />
              </ExampleCard>
            </TabsContent>
            
            <TabsContent value="editor" className="mt-0">
              <ExampleCard 
                title="Document Editor Tests" 
                description="Integration with document editing tests and error recovery patterns"
              >
                <ExampleDocumentEditor onTestRunComplete={handleTestRunComplete} />
              </ExampleCard>
            </TabsContent>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Implementation Code</CardTitle>
                <CardDescription>How to implement these tests</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <CodeSnippet example={activeExample} />
              </CardContent>
            </Card>
            
            {lastRunResults.length > 0 && (
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <TestMetricsViewer results={lastRunResults} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

interface ExampleCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const ExampleCard: React.FC<ExampleCardProps> = ({ title, description, children }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        All examples come with built-in tests that run automatically
      </CardFooter>
    </Card>
  );
};

// Export with error boundary for safety
export const IntegrationShowcase = withErrorBoundary(TestingIntegrationShowcase, "IntegrationShowcase");
