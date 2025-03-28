
import { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { runDocumentEditingTests } from './test-runners/documentEditingTests';
import { TestResult } from './useToolbarTestResult';
import { useToast } from '@/hooks/use-toast';

export interface UseDocumentTestingProps {
  editor: Editor | null;
  runOnMount?: boolean;
}

export const useDocumentTesting = ({ 
  editor, 
  runOnMount = true 
}: UseDocumentTestingProps) => {
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [lastRunTime, setLastRunTime] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Run tests with the current editor instance
  const runTests = () => {
    if (!editor) {
      setTestResults({
        'editor.missing': {
          name: 'Editor Instance',
          passed: false,
          message: 'No editor instance available',
          timestamp: new Date().toISOString()
        }
      });
      
      toast({
        title: 'Test Failed',
        description: 'Editor instance is not available',
        variant: 'destructive',
      });
      
      return;
    }
    
    const results = runDocumentEditingTests(editor);
    setTestResults(results);
    setLastRunTime(new Date().toISOString());
    
    // Count passed/failed tests
    const passedTests = Object.values(results).filter(r => r.passed).length;
    const totalTests = Object.keys(results).length;
    
    if (passedTests === totalTests) {
      toast({
        title: 'All Tests Passed',
        description: `${passedTests}/${totalTests} tests passed successfully`,
        variant: 'default',
      });
    } else {
      toast({
        title: 'Some Tests Failed',
        description: `${passedTests}/${totalTests} tests passed, ${totalTests - passedTests} failed`,
        variant: 'destructive',
      });
    }
  };
  
  // Reset test results
  const resetTests = () => {
    setTestResults({});
    setLastRunTime(null);
  };
  
  // Run tests on mount if specified
  useEffect(() => {
    if (runOnMount && editor) {
      // Short delay to ensure editor is fully initialized
      const timer = setTimeout(() => {
        runTests();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [editor, runOnMount]);
  
  return {
    testResults,
    lastRunTime,
    runTests,
    resetTests
  };
};
