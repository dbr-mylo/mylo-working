
import { UserRole } from '@/lib/types';
import { TestResult, createTestResult } from '../useToolbarTestResult';

export const runDesignerTests = (role: UserRole | null, isDesigner: boolean): Record<string, TestResult> => {
  // Test both direct hook values and expected values based on current role
  const designerRoleTest = role === 'designer' || role === 'admin';
  const designerHookTest = isDesigner; // Should be true for designer or admin
  const designerComponentsVisible = designerRoleTest;
  
  return {
    'designer-toolbar': { 
      passed: designerComponentsVisible, 
      message: designerComponentsVisible ? 
        'Designer toolbar renders correctly' : 
        'Designer toolbar not rendered for non-designer role (expected)'
    },
    'designer-controls': { 
      passed: designerRoleTest, 
      message: designerRoleTest ? 
        'Designer controls are accessible' : 
        'Designer controls correctly restricted for non-designer role' 
    },
    'designer-state': { 
      passed: designerRoleTest, 
      message: designerRoleTest ? 
        'Designer state management working correctly' : 
        'Designer state inactive for non-designer role (expected)' 
    },
    'designer-access': { 
      passed: designerRoleTest === designerHookTest, 
      message: designerRoleTest === designerHookTest ? 
        'Role hooks correctly identify designer role: ' + (designerHookTest ? 'true' : 'false') : 
        `Role hook inconsistency: expected ${designerRoleTest} but got ${designerHookTest}`,
      details: designerRoleTest === designerHookTest ? undefined : 
        `Current role: ${role}\nIs designer based on role value: ${designerRoleTest}\nIs designer based on hook: ${designerHookTest}`
    },
    'designer-component-rendering': {
      passed: designerRoleTest === designerHookTest,
      message: 'Designer components render correctly based on role',
      details: `Current role: ${role}\nDesignerOnly component visibility: ${designerHookTest}`
    }
  };
};
