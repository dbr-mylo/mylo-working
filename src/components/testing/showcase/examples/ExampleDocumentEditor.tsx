
import React, { useEffect, useState } from 'react';
import { useSmokeTest } from '@/hooks/smoke-testing/useSmokeTest';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Bold, Italic, Underline, RefreshCw, Play, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useDocumentTesting } from '@/components/toolbar/testing/hooks';
import { toast } from 'sonner';

interface MockEditorProps {
  onBoldClick?: () => void;
  onItalicClick?: () => void;
  onUnderlineClick?: () => void;
  onResetClick?: () => void;
  content: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
}

// Simple mock editor since we can't import the real editor here
const MockEditor: React.FC<MockEditorProps> = ({
  onBoldClick,
  onItalicClick,
  onUnderlineClick,
  onResetClick,
  content,
  isBold,
  isItalic,
  isUnderline
}) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        <Button 
          variant={isBold ? "default" : "outline"} 
          size="icon" 
          onClick={onBoldClick}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          variant={isItalic ? "default" : "outline"} 
          size="icon" 
          onClick={onItalicClick}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          variant={isUnderline ? "default" : "outline"} 
          size="icon" 
          onClick={onUnderlineClick}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onResetClick}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <div 
        className={`border p-3 rounded-md min-h-[100px] ${isBold ? 'font-bold' : ''} ${isItalic ? 'italic' : ''} ${isUnderline ? 'underline' : ''}`}
      >
        {content}
      </div>
    </div>
  );
};

interface ExampleDocumentEditorProps {
  onTestRunComplete?: (results: any[]) => void;
}

export const ExampleDocumentEditor: React.FC<ExampleDocumentEditorProps> = ({ onTestRunComplete }) => {
  // Mock editor state
  const [content, setContent] = useState<string>("This is a sample document for testing formatting.");
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  
  // Initialize smoke test
  const { testFeature, lastTestResult } = useSmokeTest(
    "ExampleDocumentEditor",
    [isBold, isItalic, isUnderline], 
    { category: "editor" }
  );
  
  // We'll use a mock version of the document testing hook for demo purposes
  const [mockTestResults, setMockTestResults] = useState<Record<string, any>>({});
  const [mockStats, setMockStats] = useState<{
    totalTests: number;
    passedTests: number;
    failedTests: number;
  }>({
    totalTests: 0,
    passedTests: 0,
    failedTests: 0
  });
  
  const runMockTests = async () => {
    setIsRunningTests(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create mock test results
    const results: Record<string, any> = {
      'editor.instance': {
        passed: true,
        message: 'Editor is available and editable',
        name: 'Editor Instance',
        timestamp: new Date().toISOString()
      },
      'editor.formatting.bold': {
        passed: true,
        message: 'Successfully applied bold formatting',
        name: 'Bold Formatting',
        timestamp: new Date().toISOString()
      },
      'editor.formatting.italic': {
        passed: true,
        message: 'Successfully applied italic formatting',
        name: 'Italic Formatting',
        timestamp: new Date().toISOString()
      },
      'editor.formatting.underline': {
        passed: Math.random() > 0.3, // Randomly fail sometimes to show error handling
        message: Math.random() > 0.3 ? 'Successfully applied underline formatting' : 'Failed to apply underline formatting',
        name: 'Underline Formatting',
        timestamp: new Date().toISOString()
      },
      'editor.undoRedo': {
        passed: Math.random() > 0.2, // Randomly fail sometimes to show error handling
        message: Math.random() > 0.2 ? 'Undo and redo functions work correctly' : 'Redo failed',
        name: 'Undo/Redo Functionality',
        timestamp: new Date().toISOString()
      }
    };
    
    setMockTestResults(results);
    
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(r => r.passed).length;
    
    setMockStats({
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests
    });
    
    if (onTestRunComplete) {
      const resultArray = Object.entries(results).map(([id, result]) => ({
        component: id,
        passed: result.passed,
        timestamp: result.timestamp,
        error: result.passed ? undefined : result.message
      }));
      
      onTestRunComplete(resultArray);
    }
    
    setIsRunningTests(false);
    
    if (passedTests === totalTests) {
      toast.success("All document tests passed!");
    } else {
      toast.error(`${totalTests - passedTests} tests failed`, {
        description: "Check the test results for details"
      });
    }
  };
  
  // Format text with Bold
  const toggleBold = () => {
    testFeature("boldFormat", () => {
      const newBoldState = !isBold;
      setIsBold(newBoldState);
      
      // Verify bold state was updated correctly
      if (isBold === newBoldState) {
        throw new Error("Bold state didn't update correctly");
      }
      return true;
    });
  };
  
  // Format text with Italic
  const toggleItalic = () => {
    testFeature("italicFormat", () => {
      const newItalicState = !isItalic;
      setIsItalic(newItalicState);
      
      // Verify italic state was updated correctly
      if (isItalic === newItalicState) {
        throw new Error("Italic state didn't update correctly");
      }
      return true;
    });
  };
  
  // Format text with Underline
  const toggleUnderline = () => {
    testFeature("underlineFormat", () => {
      const newUnderlineState = !isUnderline;
      setIsUnderline(newUnderlineState);
      
      // Verify underline state was updated correctly
      if (isUnderline === newUnderlineState) {
        throw new Error("Underline state didn't update correctly");
      }
      return true;
    });
  };
  
  // Reset formatting
  const resetFormatting = () => {
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    
    // Test reset functionality
    testFeature("resetFormatting", () => {
      if (isBold || isItalic || isUnderline) {
        throw new Error("Format reset failed");
      }
      return true;
    });
  };
  
  // Report smoke test results
  useEffect(() => {
    if (lastTestResult && onTestRunComplete) {
      onTestRunComplete([lastTestResult]);
    }
  }, [lastTestResult, onTestRunComplete]);
  
  return (
    <div className="space-y-6">
      <MockEditor 
        content={content}
        isBold={isBold}
        isItalic={isItalic}
        isUnderline={isUnderline}
        onBoldClick={toggleBold}
        onItalicClick={toggleItalic}
        onUnderlineClick={toggleUnderline}
        onResetClick={resetFormatting}
      />
      
      <div className="flex justify-between items-center">
        <div className="text-sm">
          <span className="font-medium">Test Status:</span>
          <span className="ml-2">
            {Object.keys(mockTestResults).length === 0 ? (
              <Badge variant="outline">No tests run</Badge>
            ) : (
              <Badge variant={mockStats.failedTests === 0 ? "outline" : "destructive"} 
                className={mockStats.failedTests === 0 ? "border-green-500 text-green-500" : ""}>
                {mockStats.passedTests}/{mockStats.totalTests} Passed
              </Badge>
            )}
          </span>
        </div>
        
        <Button onClick={runMockTests} disabled={isRunningTests}>
          {isRunningTests ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Run All Tests
            </>
          )}
        </Button>
      </div>
      
      {Object.keys(mockTestResults).length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="font-medium text-sm">Recent Test Results:</div>
              <div className="space-y-2">
                {Object.entries(mockTestResults).map(([id, result]) => (
                  <div key={id} className="flex items-start text-sm">
                    {result.passed ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-medium">{result.name}</div>
                      <div className="text-xs text-muted-foreground">{result.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="text-sm space-y-2">
        <p className="font-medium">How It Works:</p>
        <p className="text-muted-foreground">
          This demo shows how to test document editing operations. Click on the formatting buttons to see
          real-time testing of state changes. Use "Run All Tests" to see comprehensive test reporting.
          In a real implementation, this would use the document editor instance.
        </p>
      </div>
    </div>
  );
};
