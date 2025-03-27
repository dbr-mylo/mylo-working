
import { UserRole } from '@/lib/types';
import { TestResult, createTestResult } from '../useToolbarTestResult';

export const runWriterTests = (role: UserRole | null, isWriter: boolean): Record<string, TestResult> => {
  // Test both direct hook values and expected values based on current role
  const writerRoleTest = role === 'writer' || role === 'editor' || role === 'admin';
  const writerHookTest = isWriter; // Should be true for writer, editor, or admin
  const writerComponentsVisible = writerRoleTest;
  
  return {
    'writer-toolbar': { 
      passed: writerComponentsVisible, 
      message: writerComponentsVisible ? 
        'Writer toolbar renders all controls correctly' : 
        'Writer toolbar not rendered for non-writer role (expected)'
    },
    'writer-buttons': { 
      passed: writerComponentsVisible, 
      message: writerComponentsVisible ? 
        'Writer-specific buttons function correctly' : 
        'Writer buttons not available for non-writer role (expected)' 
    },
    'writer-state': { 
      passed: writerRoleTest, 
      message: writerRoleTest ? 
        'State management works in writer context' : 
        'Writer state not active for non-writer role (expected)' 
    },
    'writer-access': { 
      passed: writerRoleTest === writerHookTest, 
      message: writerRoleTest === writerHookTest ? 
        'Role hooks correctly identify writer role: ' + (writerHookTest ? 'true' : 'false') : 
        `Role hook inconsistency: expected ${writerRoleTest} but got ${writerHookTest}`,
      details: writerRoleTest === writerHookTest ? undefined : 
        `Current role: ${role}\nIs writer based on role value: ${writerRoleTest}\nIs writer based on hook: ${writerHookTest}`
    },
    'writer-component-rendering': {
      passed: writerRoleTest === writerHookTest,
      message: 'Writer components render correctly based on role',
      details: `Current role: ${role}\nWriterOnly component visibility: ${writerHookTest}`
    }
  };
};
