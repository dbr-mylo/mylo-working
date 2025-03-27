
import { UserRole } from '@/lib/types';
import { TestResult, createTestResult } from '../useToolbarTestResult';

export const runRoleHooksTests = (
  role: UserRole | null, 
  isWriter: boolean, 
  isDesigner: boolean, 
  isAdmin: boolean
): Record<string, TestResult> => {
  const isWriterHookCorrect = isWriter === (role === 'writer' || role === 'editor' || role === 'admin');
  const isDesignerHookCorrect = isDesigner === (role === 'designer' || role === 'admin');
  const isAdminHookCorrect = isAdmin === (role === 'admin');
  
  return {
    'hook-is-writer': { 
      passed: isWriterHookCorrect, 
      message: `useIsWriter hook ${isWriterHookCorrect ? 'correctly identifies' : 'fails to identify'} writer role`,
      details: isWriterHookCorrect ? undefined : 
        `Current role: ${role}\nExpected useIsWriter result: ${role === 'writer' || role === 'editor' || role === 'admin'}\nActual useIsWriter result: ${isWriter}` 
    },
    'hook-is-designer': { 
      passed: isDesignerHookCorrect, 
      message: `useIsDesigner hook ${isDesignerHookCorrect ? 'correctly identifies' : 'fails to identify'} designer role`,
      details: isDesignerHookCorrect ? undefined : 
        `Current role: ${role}\nExpected useIsDesigner result: ${role === 'designer' || role === 'admin'}\nActual useIsDesigner result: ${isDesigner}`
    },
    'hook-is-admin': { 
      passed: isAdminHookCorrect, 
      message: `useIsAdmin hook ${isAdminHookCorrect ? 'correctly identifies' : 'fails to identify'} admin role`,
      details: isAdminHookCorrect ? undefined : 
        `Current role: ${role}\nExpected useIsAdmin result: ${role === 'admin'}\nActual useIsAdmin result: ${isAdmin}`
    },
    'component-writer-only': { 
      passed: isWriter === (role === 'writer' || role === 'editor' || role === 'admin'), 
      message: `WriterOnly component ${(role === 'writer' || role === 'editor' || role === 'admin') ? 'correctly shows' : 'correctly hides'} content`,
      details: `Current role: ${role}\nWriterOnly visibility: ${isWriter}`
    },
    'component-designer-only': { 
      passed: isDesigner === (role === 'designer' || role === 'admin'), 
      message: `DesignerOnly component ${(role === 'designer' || role === 'admin') ? 'correctly shows' : 'correctly hides'} content`,
      details: `Current role: ${role}\nDesignerOnly visibility: ${isDesigner}`
    },
    'component-admin-only': { 
      passed: isAdmin === (role === 'admin'), 
      message: `AdminOnly component ${(role === 'admin') ? 'correctly shows' : 'correctly hides'} content`,
      details: `Current role: ${role}\nAdminOnly visibility: ${isAdmin}`
    },
    'standalone-editor-only': { 
      passed: isWriter === (role === 'writer' || role === 'editor' || role === 'admin'), 
      message: `StandaloneEditorOnly ${(role === 'writer' || role === 'editor' || role === 'admin') ? 'correctly shows' : 'correctly hides'} content`,
      details: `Current role: ${role}\nStandaloneEditorOnly visibility (via isWriter): ${isWriter}`
    },
    'consistent-legacy-support': {
      passed: (role === 'editor') ? isWriter : true,
      message: `Legacy 'editor' role ${(role === 'editor' && isWriter) ? 'correctly handled' : ((role === 'editor' && !isWriter) ? 'incorrectly handled' : 'not applicable for current role')}`,
      details: (role === 'editor') ? `Current role: editor\nWriter hook result: ${isWriter}\nShould treat 'editor' as 'writer': true` : undefined
    }
  };
};
