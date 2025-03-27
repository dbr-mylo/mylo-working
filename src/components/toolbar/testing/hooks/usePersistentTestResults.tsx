
import { useState, useEffect } from 'react';

export interface TestItem {
  id: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'passed' | 'failed' | 'untested';
  notes: string;
}

export const usePersistentTestResults = (initialTests: TestItem[]) => {
  // Load saved tests from localStorage or use initial tests
  const [testItems, setTestItems] = useState<TestItem[]>(() => {
    const savedTests = localStorage.getItem('manual-test-results');
    if (savedTests) {
      try {
        return JSON.parse(savedTests);
      } catch (e) {
        console.error('Error parsing saved tests:', e);
        return initialTests;
      }
    }
    return initialTests;
  });

  // Save tests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('manual-test-results', JSON.stringify(testItems));
  }, [testItems]);

  const updateTestStatus = (id: string, status: 'passed' | 'failed' | 'untested') => {
    setTestItems(items => 
      items.map(item => 
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const updateTestNotes = (id: string, notes: string) => {
    setTestItems(items => 
      items.map(item => 
        item.id === id ? { ...item, notes } : item
      )
    );
  };

  const resetAllTests = () => {
    setTestItems(initialTests);
    localStorage.removeItem('manual-test-results');
  };

  return {
    testItems,
    updateTestStatus,
    updateTestNotes,
    resetAllTests
  };
};
