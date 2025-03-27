
import { useState, useEffect } from 'react';
import { UserRole } from '@/lib/types';
import { TestResult } from './useToolbarTestResult';

export const useToolbarPersistence = () => {
  // Load current test from localStorage
  const [currentTest, setCurrentTest] = useState<string>(() => {
    const savedTest = localStorage.getItem('toolbar-current-test');
    return savedTest || 'base';
  });
  
  // Load content from localStorage
  const [content, setContent] = useState<string>(() => {
    const savedContent = localStorage.getItem('toolbar-content');
    return savedContent || '<p>Test content for toolbar components</p>';
  });
  
  // Load test results from localStorage
  const [testResults, setTestResults] = useState<Record<string, TestResult>>(() => {
    const savedResults = localStorage.getItem('toolbar-test-results');
    if (savedResults) {
      try {
        return JSON.parse(savedResults);
      } catch (e) {
        console.error('Error parsing saved test results:', e);
        return {};
      }
    }
    return {};
  });
  
  // Load selected role from localStorage
  const [selectedRoleForTesting, setSelectedRoleForTesting] = useState<UserRole | null>(() => {
    const savedRole = localStorage.getItem('toolbar-selected-role');
    return savedRole ? savedRole as UserRole : null;
  });

  // Save current test to localStorage
  useEffect(() => {
    localStorage.setItem('toolbar-current-test', currentTest);
  }, [currentTest]);
  
  // Save content to localStorage
  useEffect(() => {
    localStorage.setItem('toolbar-content', content);
  }, [content]);
  
  // Save test results to localStorage
  useEffect(() => {
    localStorage.setItem('toolbar-test-results', JSON.stringify(testResults));
  }, [testResults]);
  
  // Save selected role to localStorage
  useEffect(() => {
    if (selectedRoleForTesting) {
      localStorage.setItem('toolbar-selected-role', selectedRoleForTesting);
    }
  }, [selectedRoleForTesting]);

  const resetTestResults = () => {
    setTestResults({});
    localStorage.removeItem('toolbar-test-results');
  };

  return {
    currentTest,
    setCurrentTest,
    content,
    setContent,
    testResults,
    setTestResults,
    selectedRoleForTesting,
    setSelectedRoleForTesting,
    resetTestResults
  };
};
