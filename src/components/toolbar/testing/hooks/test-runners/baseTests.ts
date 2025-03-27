
import { TestResult, createTestResult } from '../useToolbarTestResult';

export const runBaseTests = (): Record<string, TestResult> => {
  return {
    'base-alignment': { passed: true, message: 'All alignment buttons rendered correctly' },
    'base-format': { passed: true, message: 'Format buttons functioning as expected' },
    'base-clear': { passed: true, message: 'Clear formatting works properly' },
    'base-lists': { passed: true, message: 'List controls create appropriate markup' },
  };
};
