
export interface TestCase {
  name: string;
  pattern: string;
  path: string;
  expectedParams?: Record<string, string>;
  expectedErrors?: string[];
}

export const DEFAULT_TEST_CASES: TestCase[] = [
  {
    name: 'Basic Nested Parameters',
    pattern: '/products/:category?/:subcategory?/:productId',
    path: '/products/electronics/laptops/p123',
    expectedParams: {
      category: 'electronics',
      subcategory: 'laptops',
      productId: 'p123'
    }
  },
  {
    name: 'Missing Optional Parameter',
    pattern: '/products/:category?/:productId',
    path: '/products//p123',
    expectedParams: {
      category: '',
      productId: 'p123'
    }
  },
  {
    name: 'Deep Nesting',
    pattern: '/org/:orgId/team/:teamId/project/:projectId/task/:taskId',
    path: '/org/o123/team/t456/project/p789/task/t101',
    expectedParams: {
      orgId: 'o123',
      teamId: 't456',
      projectId: 'p789',
      taskId: 't101'
    }
  }
];
