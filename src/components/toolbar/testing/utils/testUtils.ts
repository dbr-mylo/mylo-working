
import { TestItem } from '../hooks/usePersistentTestResults';

export const getStatusBadgeColor = (status: string) => {
  switch(status) {
    case 'passed': return 'bg-green-500';
    case 'failed': return 'bg-red-500';
    case 'untested': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
};

export const exportTestReport = (testItems: TestItem[], stats: {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  untestedTests: number;
}, toast: any) => {
  const reportData = {
    date: new Date().toISOString(),
    summary: {
      total: stats.totalTests,
      passed: stats.passedTests,
      failed: stats.failedTests,
      untested: stats.untestedTests
    },
    tests: testItems
  };
  
  const jsonString = JSON.stringify(reportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `role-based-test-report-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  toast({
    title: "Test report exported",
    description: "Report successfully downloaded as JSON file",
    duration: 3000,
  });
};
