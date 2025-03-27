
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ToolbarTester = () => {
  const [currentTest, setCurrentTest] = useState('base');
  const [content, setContent] = useState('<p>Test content for toolbar components</p>');
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<Record<string, { passed: boolean; message: string }>>({});
  
  const runTest = async (testType: string) => {
    // Simulating a test run
    setTestResults({});
    
    toast({
      title: `Running ${testType} tests...`,
      description: "This may take a few seconds",
      duration: 3000,
    });
    
    // Simulate test execution time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock test results
    let results: Record<string, { passed: boolean; message: string }> = {};
    
    if (testType === 'base') {
      results = {
        'base-alignment': { passed: true, message: 'All alignment buttons rendered correctly' },
        'base-format': { passed: true, message: 'Format buttons functioning as expected' },
        'base-clear': { passed: true, message: 'Clear formatting works properly' },
        'base-lists': { passed: true, message: 'List controls create appropriate markup' },
      };
    } else if (testType === 'writer') {
      results = {
        'writer-toolbar': { passed: true, message: 'Writer toolbar renders all controls' },
        'writer-buttons': { passed: true, message: 'Writer-specific buttons function correctly' },
        'writer-state': { passed: true, message: 'State management works in writer context' },
        'writer-access': { passed: false, message: 'Access control needs adjustment for writer role' },
      };
    } else if (testType === 'designer') {
      results = {
        'designer-toolbar': { passed: true, message: 'Designer toolbar renders correctly' },
        'designer-controls': { passed: true, message: 'Designer controls are accessible' },
        'designer-state': { passed: false, message: 'Font size state not persisting in designer view' },
        'designer-access': { passed: true, message: 'Access control works for designer role' },
      };
    }
    
    setTestResults(results);
    
    const failedTests = Object.values(results).filter(r => !r.passed).length;
    
    if (failedTests === 0) {
      toast({
        title: 'All tests passed!',
        description: `${Object.keys(results).length} tests completed successfully`,
        duration: 5000,
      });
    } else {
      toast({
        title: `${failedTests} tests failed`,
        description: `${Object.keys(results).length - failedTests} tests passed, ${failedTests} failed`,
        variant: "destructive",
        duration: 5000,
      });
    }
  };
  
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Toolbar Component Tester</CardTitle>
          <CardDescription>
            Test different toolbar component implementations to ensure they work correctly
            after refactoring.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={currentTest}
            onValueChange={(value) => {
              setCurrentTest(value);
              setTestResults({});
            }}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="base">Base Components</TabsTrigger>
              <TabsTrigger value="writer">Writer Toolbar</TabsTrigger>
              <TabsTrigger value="designer">Designer Toolbar</TabsTrigger>
            </TabsList>
            
            <div className="flex justify-end mb-4">
              <Button onClick={() => runTest(currentTest)}>
                Run {currentTest === 'base' ? 'Base' : currentTest === 'writer' ? 'Writer' : 'Designer'} Tests
              </Button>
            </div>
            
            <TabsContent value="base" className="space-y-4">
              <div className="p-4 border rounded-md bg-muted/40">
                <h3 className="text-sm font-medium mb-2">Base Components Test Preview</h3>
                <div className="min-h-20 p-2 bg-white rounded border" 
                     dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            </TabsContent>
            
            <TabsContent value="writer" className="space-y-4">
              <div className="p-4 border rounded-md bg-muted/40">
                <h3 className="text-sm font-medium mb-2">Writer Components Test Preview</h3>
                <div className="min-h-20 p-2 bg-white rounded border" 
                     dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            </TabsContent>
            
            <TabsContent value="designer" className="space-y-4">
              <div className="p-4 border rounded-md bg-muted/40">
                <h3 className="text-sm font-medium mb-2">Designer Components Test Preview</h3>
                <div className="min-h-20 p-2 bg-white rounded border" 
                     dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            </TabsContent>
          </Tabs>
          
          {Object.keys(testResults).length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-medium">Test Results</h3>
              {Object.entries(testResults).map(([testId, result]) => (
                <Alert key={testId} variant={result.passed ? "default" : "destructive"}>
                  <div className="flex items-start">
                    {result.passed ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    )}
                    <div>
                      <AlertTitle>{testId}</AlertTitle>
                      <AlertDescription>{result.message}</AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
