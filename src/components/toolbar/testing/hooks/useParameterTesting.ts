
import { useState, useCallback } from 'react';
import { benchmarkFunction } from '@/utils/navigation/parameters/performanceMonitor';
import { 
  extractNestedParameters,
  validateNestedParameters, 
  ValidationRuleBuilder
} from '@/utils/navigation/parameters/nestedParameterHandler';
import {
  memoizedExtractNestedParameters,
  memoizedValidateNestedParameters,
  clearParameterCaches
} from '@/utils/navigation/parameters/memoizedParameterHandler';

export interface ParameterTestResult {
  pattern: string;
  path: string;
  params: Record<string, string>;
  isValid: boolean;
  errors: string[];
  performance: {
    extractionTime: number;
    validationTime?: number;
    memoizedExtractionTime?: number;
    memoizedValidationTime?: number;
  };
  timestamp: number;
}

export interface ValidationTestSetup {
  paramName: string;
  ruleName: keyof typeof ValidationRuleBuilder.presets | 'custom';
  customPattern?: RegExp;
  isRequired: boolean;
}

export function useParameterTesting() {
  const [results, setResults] = useState<ParameterTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const testParameterExtraction = useCallback((
    pattern: string,
    path: string,
    validationRules?: Record<string, ReturnType<ValidationRuleBuilder['build']>>
  ) => {
    setIsLoading(true);
    
    try {
      // Benchmark regular extraction
      const { result: extractionResult, performance: extractionPerf } = benchmarkFunction(
        'extractParameters',
        () => extractNestedParameters(pattern, path)
      );
      
      // Benchmark memoized extraction
      const { result: memoizedResult, performance: memoizedPerf } = benchmarkFunction(
        'memoizedExtractParameters',
        () => memoizedExtractNestedParameters(pattern, path)
      );
      
      let validationResult = { isValid: true, errors: [] };
      let validationPerf = { executionTime: 0 };
      let memoizedValidationPerf = { executionTime: 0 };
      
      // If validation rules are provided, test validation as well
      if (validationRules) {
        const { result, performance } = benchmarkFunction(
          'validateParameters',
          () => validateNestedParameters(
            extractionResult.params,
            extractionResult.hierarchy,
            validationRules
          )
        );
        
        validationResult = result;
        validationPerf = performance;
        
        // Test memoized validation
        const { performance: memoizedValPerf } = benchmarkFunction(
          'memoizedValidateParameters',
          () => memoizedValidateNestedParameters(
            extractionResult.params,
            extractionResult.hierarchy,
            validationRules
          )
        );
        
        memoizedValidationPerf = memoizedValPerf;
      }
      
      const testResult: ParameterTestResult = {
        pattern,
        path,
        params: extractionResult.params,
        isValid: validationResult.isValid,
        errors: [...extractionResult.errors, ...(validationResult.errors || [])],
        performance: {
          extractionTime: extractionPerf.executionTime,
          validationTime: validationPerf.executionTime,
          memoizedExtractionTime: memoizedPerf.executionTime,
          memoizedValidationTime: memoizedValidationPerf.executionTime
        },
        timestamp: Date.now()
      };
      
      setResults(prev => [testResult, ...prev]);
      return testResult;
      
    } catch (error) {
      console.error('Parameter test error:', error);
      
      const errorResult: ParameterTestResult = {
        pattern,
        path,
        params: {},
        isValid: false,
        errors: [error instanceof Error ? error.message : String(error)],
        performance: { extractionTime: 0 },
        timestamp: Date.now()
      };
      
      setResults(prev => [errorResult, ...prev]);
      return errorResult;
      
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const clearResults = useCallback(() => {
    setResults([]);
  }, []);
  
  const clearCaches = useCallback(() => {
    clearParameterCaches();
  }, []);
  
  const createValidationRule = useCallback((setup: ValidationTestSetup) => {
    let builder: ValidationRuleBuilder;
    
    if (setup.ruleName === 'custom' && setup.customPattern) {
      builder = new ValidationRuleBuilder().pattern(setup.customPattern);
    } else if (setup.ruleName !== 'custom' && setup.ruleName in ValidationRuleBuilder.presets) {
      builder = ValidationRuleBuilder.presets[setup.ruleName]();
    } else {
      builder = new ValidationRuleBuilder();
    }
    
    return setup.isRequired ? builder.required().build() : builder.optional().build();
  }, []);

  return {
    results,
    isLoading,
    testParameterExtraction,
    clearResults,
    clearCaches,
    createValidationRule
  };
}
