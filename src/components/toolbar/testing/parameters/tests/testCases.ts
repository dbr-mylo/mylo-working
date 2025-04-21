
import { ValidationRuleBuilder } from '@/utils/navigation/parameters/ValidationRuleBuilder';

export interface TestCase {
  name: string;
  pattern: string;
  path: string;
  expectedParams: Record<string, string>;
  validationRules?: Record<string, any>;
  expectedValid?: boolean;
}

export const TEST_CASES: TestCase[] = [
  {
    name: 'Basic parameter extraction',
    pattern: '/users/:userId',
    path: '/users/123',
    expectedParams: { userId: '123' },
    validationRules: {
      userId: new ValidationRuleBuilder().string().required().build()
    },
    expectedValid: true
  },
  {
    name: 'Optional parameters',
    pattern: '/products/:category?/:productId',
    path: '/products//abc123',
    expectedParams: { category: '', productId: 'abc123' },
    validationRules: {
      category: new ValidationRuleBuilder().string().build(),
      productId: new ValidationRuleBuilder().string().required().build()
    },
    expectedValid: true
  },
  {
    name: 'Multiple nested parameters',
    pattern: '/org/:orgId/team/:teamId/project/:projectId',
    path: '/org/org-123/team/team-456/project/proj-789',
    expectedParams: { orgId: 'org-123', teamId: 'team-456', projectId: 'proj-789' },
    validationRules: {
      orgId: new ValidationRuleBuilder().string().pattern(/^org-\d+$/).required().build(),
      teamId: new ValidationRuleBuilder().string().pattern(/^team-\d+$/).required().build(),
      projectId: new ValidationRuleBuilder().string().pattern(/^proj-\d+$/).required().build()
    },
    expectedValid: true
  },
  {
    name: 'Validation failure',
    pattern: '/users/:userId/posts/:postId',
    path: '/users/abc/posts/xyz',
    expectedParams: { userId: 'abc', postId: 'xyz' },
    validationRules: {
      userId: new ValidationRuleBuilder().number().required().build(),
      postId: new ValidationRuleBuilder().pattern(/^\d+$/).required().build()
    },
    expectedValid: false
  },
  {
    name: 'Complex pattern with optional segments',
    pattern: '/content/:type/:category?/:id/details/:section?',
    path: '/content/article//12345/details/comments',
    expectedParams: { 
      type: 'article', 
      category: '', 
      id: '12345', 
      section: 'comments' 
    },
    validationRules: {
      type: new ValidationRuleBuilder().string().required().build(),
      id: new ValidationRuleBuilder().string().required().build(),
      section: new ValidationRuleBuilder().string().build()
    },
    expectedValid: true
  }
];

export const PERFORMANCE_TEST_ITERATIONS = 100;
