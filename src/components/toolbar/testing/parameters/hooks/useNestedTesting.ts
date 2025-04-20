
import { useState } from 'react';
import { DEFAULT_TEST_CASES, TestCase } from '../constants/testCases';
import { extractNestedParameters, validateNestedParameters } from '@/utils/navigation/parameters/nestedParameterHandler';

export const useNestedTesting = () => {
  const [pattern, setPattern] = useState('/products/:category?/:subcategory?/:productId');
  const [path, setPath] = useState('/products/electronics/laptops/p123');
  const [testResults, setTestResults] = useState<any>(null);
  const [validationRules, setValidationRules] = useState<Record<string, any>>({});
  const [selectedTab, setSelectedTab] = useState('test');
  const [testCases] = useState<TestCase[]>(DEFAULT_TEST_CASES);

  const runTest = () => {
    const startTime = performance.now();
    const extracted = extractNestedParameters(pattern, path);
    const extractionTime = performance.now() - startTime;
    
    const validationStartTime = performance.now();
    const validation = validateNestedParameters(
      extracted.params,
      extracted.hierarchy,
      validationRules
    );
    const validationTime = performance.now() - validationStartTime;
    
    setTestResults({
      params: extracted.params,
      hierarchy: extracted.hierarchy,
      missingRequired: extracted.missingRequired,
      errors: [...extracted.errors, ...validation.errors],
      isValid: extracted.errors.length === 0 && validation.isValid,
      performance: {
        extractionTime,
        validationTime,
        totalTime: extractionTime + validationTime
      }
    });
    
    setSelectedTab('results');
  };

  const runTestCase = (testCase: TestCase) => {
    setPattern(testCase.pattern);
    setPath(testCase.path);
    setTimeout(() => runTest(), 0);
  };

  const getParameterNames = () => {
    if (!testResults) return [];
    return Object.keys(testResults.hierarchy || {});
  };

  return {
    pattern,
    setPattern,
    path,
    setPath,
    testResults,
    validationRules,
    setValidationRules,
    selectedTab,
    setSelectedTab,
    testCases,
    runTest,
    runTestCase,
    getParameterNames
  };
};
