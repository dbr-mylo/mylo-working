
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useDocumentTesting } from './hooks/useDocumentTesting';
import { TestResultsChart } from './components/TestResultsChart';
import { TestPerformanceMetrics } from './components/TestPerformanceMetrics';
import { TestAnalyticsDashboard } from './components/TestAnalyticsDashboard';
import { Loader2, RefreshCw } from 'lucide-react';

export const DocumentEditingTester = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Initialize TipTap editor for testing
  const editor = useEditor({
    extensions: [StarterKit],
    content: `
      <h2>Document Editing Test Content</h2>
      <p>This content is used to run tests on the document editing functionality.</p>
      <p>Tests include formatting, undo/redo, and other editor operations.</p>
    `,
    editable: true,
  });
  
  // Use the document testing hook
  const { 
    testResults, 
    isRunning, 
    runDuration, 
    lastRunTime,
    stats, 
    runTests, 
    resetTests 
  } = useDocumentTesting({
    editor,
    runOnMount: false,
    maxRetries: 1
  });
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Document Editing Tester</CardTitle>
              <CardDescription>
                Test document editing operations and view performance metrics
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetTests}
                disabled={isRunning}
              >
                Reset
              </Button>
              <Button 
                size="sm" 
                onClick={runTests}
                disabled={isRunning}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Run Tests
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="editor">Test Editor</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <TestAnalyticsDashboard 
                testResults={testResults}
                lastRunTime={lastRunTime}
                runDuration={runDuration}
                onRunTests={runTests}
                onResetTests={resetTests}
              />
            </TabsContent>
            
            <TabsContent value="editor">
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">Test Editor Instance</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This editor instance is used to run the document editing tests. You can interact with it manually.
                </p>
                <div className="border rounded-lg p-4 min-h-[200px] prose max-w-none">
                  {editor && <EditorContent editor={editor} />}
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Editor state: {editor?.isEditable ? 'Editable' : 'Read-only'}</p>
                  <p>Content size: {editor?.getHTML().length || 0} characters</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="results">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Test Results Summary</h3>
                  <TestResultsChart testResults={testResults} />
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="border rounded-lg p-4">
                      <div className="text-sm font-medium">Tests Passed</div>
                      <div className="text-2xl font-bold text-green-600">
                        {stats.passedTests}/{stats.totalTests}
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="text-sm font-medium">Pass Rate</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {stats.totalTests > 0 
                          ? Math.round((stats.passedTests / stats.totalTests) * 100)
                          : 0}%
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Test Details</h3>
                  <div className="border rounded-lg divide-y max-h-[400px] overflow-y-auto">
                    {Object.entries(testResults).length > 0 ? (
                      Object.entries(testResults).map(([id, result]) => (
                        <div key={id} className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{result.name || id}</div>
                            <div className={`px-2 py-1 rounded text-xs ${
                              result.passed 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {result.passed ? 'PASSED' : 'FAILED'}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {result.message}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        No test results available. Run tests to see results.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="performance">
              <TestPerformanceMetrics testResults={testResults} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
