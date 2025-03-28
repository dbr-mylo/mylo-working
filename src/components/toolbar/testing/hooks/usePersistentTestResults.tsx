
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define the test item structure
export interface TestItem {
  id: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'passed' | 'failed' | 'untested';
  notes: string;
  lastUpdated?: string;
  testedBy?: string;
  duration?: number;
  expectedResult?: string;
  actualResult?: string;
}

// Hook for managing persistent test results
export const usePersistentTestResults = () => {
  const [testItems, setTestItems] = useState<TestItem[]>([]);

  // Load test items from localStorage on initial render
  useEffect(() => {
    try {
      const savedTests = localStorage.getItem('roleBasedTestResults');
      if (savedTests) {
        setTestItems(JSON.parse(savedTests));
      } else {
        // If no data exists, fetch from the JSON file
        fetch('role-based-test-report-2025-03-27 (1).json')
          .then(response => response.json())
          .then(data => {
            if (data && data.tests && Array.isArray(data.tests)) {
              setTestItems(data.tests);
              // Save to localStorage for future visits
              localStorage.setItem('roleBasedTestResults', JSON.stringify(data.tests));
            }
          })
          .catch(error => {
            console.error('Error loading test report:', error);
          });
      }
    } catch (error) {
      console.error('Error parsing stored test results:', error);
    }
  }, []);

  // Save test items to localStorage whenever they change
  useEffect(() => {
    if (testItems.length > 0) {
      localStorage.setItem('roleBasedTestResults', JSON.stringify(testItems));
    }
  }, [testItems]);

  // Helper function to find test by ID
  const findTestIndex = (id: string) => {
    return testItems.findIndex(item => item.id === id);
  };

  // Update test status
  const updateTestStatus = (id: string, status: 'passed' | 'failed' | 'untested') => {
    const index = findTestIndex(id);
    if (index !== -1) {
      const newTests = [...testItems];
      newTests[index] = {
        ...newTests[index],
        status,
        lastUpdated: new Date().toISOString(),
        testedBy: 'Current User' // Would typically come from auth
      };
      setTestItems(newTests);
      toast.success(`Test ${id} status updated to ${status}`);
    }
  };

  // Update test notes
  const updateTestNotes = (id: string, notes: string) => {
    const index = findTestIndex(id);
    if (index !== -1) {
      const newTests = [...testItems];
      newTests[index] = {
        ...newTests[index],
        notes,
        lastUpdated: new Date().toISOString()
      };
      setTestItems(newTests);
    }
  };

  // Add a new test
  const addTest = (test: Omit<TestItem, 'status' | 'notes' | 'lastUpdated'>) => {
    const newTest: TestItem = {
      ...test,
      status: 'untested',
      notes: '',
      lastUpdated: new Date().toISOString()
    };
    setTestItems([...testItems, newTest]);
    toast.success(`New test ${test.id} added`);
  };

  // Reset all tests to untested
  const resetAllTests = () => {
    const resetTests = testItems.map(test => ({
      ...test,
      status: 'untested' as const,
      notes: '',
      lastUpdated: new Date().toISOString()
    }));
    setTestItems(resetTests);
    toast.success('All tests reset to untested');
  };

  // Export test results as JSON
  const exportTests = () => {
    const exportData = {
      date: new Date().toISOString(),
      summary: {
        total: testItems.length,
        passed: testItems.filter(item => item.status === 'passed').length,
        failed: testItems.filter(item => item.status === 'failed').length,
        untested: testItems.filter(item => item.status === 'untested').length
      },
      tests: testItems
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `role-based-test-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Test report exported successfully');
  };

  // Get a function to determine badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'untested':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return {
    testItems,
    updateTestStatus,
    updateTestNotes,
    addTest,
    resetAllTests,
    exportTests,
    getStatusBadgeColor
  };
};
