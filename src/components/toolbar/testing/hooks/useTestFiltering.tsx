
import { useState, useMemo } from 'react';
import { TestItem } from './usePersistentTestResults';

export const useTestFiltering = (testItems: TestItem[]) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter and search functionality
  const filteredTests = useMemo(() => {
    return testItems.filter(item => {
      const matchesFilter = filter === 'all' || item.category === filter;
      const matchesSearch = searchTerm === '' || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [testItems, filter, searchTerm]);

  // Stats calculations
  const totalTests = filteredTests.length;
  const passedTests = filteredTests.filter(item => item.status === 'passed').length;
  const failedTests = filteredTests.filter(item => item.status === 'failed').length;
  const untestedTests = filteredTests.filter(item => item.status === 'untested').length;

  return {
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    filteredTests,
    stats: {
      totalTests,
      passedTests,
      failedTests,
      untestedTests
    }
  };
};
