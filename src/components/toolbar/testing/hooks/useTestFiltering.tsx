
import { useState, useMemo } from 'react';
import { TestItem } from './usePersistentTestResults';

export const useTestFiltering = (testItems: TestItem[]) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter and search functionality
  const filteredTests = useMemo(() => {
    return testItems.filter(item => {
      // Category filter
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      
      // Priority filter
      const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      // Search term
      const matchesSearch = searchTerm === '' || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.notes.toLowerCase().includes(searchTerm.toLowerCase());
        
      return matchesCategory && matchesPriority && matchesStatus && matchesSearch;
    });
  }, [testItems, categoryFilter, priorityFilter, statusFilter, searchTerm]);

  // Stats calculations
  const totalTests = filteredTests.length;
  const passedTests = filteredTests.filter(item => item.status === 'passed').length;
  const failedTests = filteredTests.filter(item => item.status === 'failed').length;
  const untestedTests = filteredTests.filter(item => item.status === 'untested').length;

  // High priority stats
  const highPriorityTotal = filteredTests.filter(item => item.priority === 'high').length;
  const highPriorityPassed = filteredTests.filter(item => item.priority === 'high' && item.status === 'passed').length;
  const highPriorityPercentage = highPriorityTotal > 0 
    ? Math.round((highPriorityPassed / highPriorityTotal) * 100) 
    : 0;

  return {
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    filteredTests,
    stats: {
      totalTests,
      passedTests,
      failedTests,
      untestedTests,
      highPriorityTotal,
      highPriorityPassed,
      highPriorityPercentage
    }
  };
};
