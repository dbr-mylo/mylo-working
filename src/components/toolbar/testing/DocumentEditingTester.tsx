
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, RefreshCw } from 'lucide-react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@/components/rich-text/extensions/FontFamily';
import { FontSize } from '@/components/rich-text/extensions/FontSize';
import { useDocumentTesting } from './hooks/useDocumentTesting';
import { TestResults } from './components/TestResults';
import { TestAnalyticsDashboard } from './components/TestAnalyticsDashboard';
import { WithErrorBoundary } from '@/components/errors/WithErrorBoundary';

export const DocumentEditingTester: React.FC = () => {
  const [content, setContent] = useState('<p>Test document content</p>');
  const [showAnalytics, setShowAnalytics] = useState(true);
  
  // Initialize a minimal editor for testing
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily,
      FontSize.configure({
        types: ['textStyle'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });
  
  // Use our enhanced hook for document testing
  const { 
    testResults, 
    lastRunTime,
    runDuration,
    isRunning,
    runTests, 
    resetTests 
  } = useDocumentTesting({ 
    editor,
    runOnMount: true,
    maxRetries: 1,
    trackAnalytics: true
  });
  
  // Calculate test statistics
  const totalTests = Object.keys(testResults).length;
  const passedTests = Object.values(testResults).filter(r => r.passed).length;
  const failedTests = totalTests - passedTests;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Document Editing Tests</CardTitle>
            <CardDescription>
              Tests for core document editing functionality
            </CardDescription>
          </div>
          <Button 
            variant="outline"
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            {showAnalytics ? "Hide Analytics" : "Show Analytics"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAnalytics ? (
          <WithErrorBoundary context="TestAnalyticsDashboard" allowReset>
            <TestAnalyticsDashboard
              testResults={testResults}
              lastRunTime={lastRunTime}
              runDuration={runDuration}
              onRunTests={runTests}
              onResetTests={resetTests}
            />
          </WithErrorBoundary>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">
                  {totalTests} tests
                </div>
                <div className="text-sm text-green-500">
                  {passedTests} passed
                </div>
                {failedTests > 0 && (
                  <div className="text-sm text-red-500">
                    {failedTests} failed
                  </div>
                )}
              </div>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetTests}
                  disabled={isRunning}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  size="sm" 
                  onClick={runTests}
                  disabled={isRunning}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isRunning ? 'Running...' : 'Run Tests'}
                </Button>
              </div>
            </div>
            
            <div className="border rounded-md p-4 bg-muted/40">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
            
            <TestResults results={testResults} />
          </>
        )}
      </CardContent>
    </Card>
  );
};
