
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/lib/types';
import { useIsWriter, useIsDesigner, useIsAdmin } from '@/utils/roles';
import { TestResult } from './useToolbarTestResult';
import { 
  runBaseTests, 
  runWriterTests, 
  runDesignerTests, 
  runRoleHooksTests 
} from './test-runners';

export const useToolbarTestExecution = (
  setTestResults: (results: Record<string, TestResult>) => void
) => {
  const { toast } = useToast();
  
  // Get role hooks for direct testing
  const isWriter = useIsWriter();
  const isDesigner = useIsDesigner();
  const isAdmin = useIsAdmin();
  
  const runTest = async (testType: string, role: UserRole | null) => {
    setTestResults({});
    
    toast({
      title: `Running ${testType} tests...`,
      description: `This may take a few seconds. Current role: ${role}`,
      duration: 3000,
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let results: Record<string, TestResult> = {};
    
    // Use the appropriate test runner based on test type
    if (testType === 'base') {
      results = runBaseTests();
    } else if (testType === 'writer') {
      results = runWriterTests(role, isWriter);
    } else if (testType === 'designer') {
      results = runDesignerTests(role, isDesigner);
    } else if (testType === 'role-hooks') {
      results = runRoleHooksTests(role, isWriter, isDesigner, isAdmin);
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

  return { runTest };
};
