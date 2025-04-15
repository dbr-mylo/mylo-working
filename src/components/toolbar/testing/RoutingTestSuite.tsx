
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { UserRole } from '@/utils/navigation/types';
import { navigationService } from '@/services/navigation/NavigationService';
import { findParentRoutes, getBreadcrumbPath, findChildRoutes, findAlternativeRoutes } from '@/utils/navigation/config/routeRelationships';
import { mockUtils } from '@/utils/testUtils';

export const RoutingTestSuite: React.FC = () => {
  const { toast } = useToast();
  const [testPath, setTestPath] = useState('/admin/users');
  const [testRole, setTestRole] = useState<UserRole>('admin');
  const [results, setResults] = useState<any[]>([]);
  
  // Test route relationships
  const testRouteRelationships = () => {
    try {
      // Get all relationships for the current path
      const relationships = {
        breadcrumbs: getBreadcrumbPath(testPath),
        parentRoutes: findParentRoutes(testPath),
        childRoutes: findChildRoutes(testPath),
        alternativeRoutes: findAlternativeRoutes(testPath)
      };
      
      setResults(prev => [
        {
          test: 'Route Relationships',
          path: testPath,
          role: testRole,
          result: relationships,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
      
      toast({
        title: 'Route relationship test complete',
        description: `Found ${relationships.breadcrumbs.length} breadcrumb items, ${relationships.parentRoutes.length} parents, ${relationships.childRoutes.length} children and ${relationships.alternativeRoutes.length} alternatives`,
      });
    } catch (error) {
      toast({
        title: 'Error testing route relationships',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };
  
  // Test complex route parameters
  const testComplexParameters = () => {
    try {
      // Create a complex dynamic route pattern
      const pattern = '/content/:contentType/:documentId/version/:versionId/edit/:mode';
      const actualPath = '/content/article/doc-123/version/v2/edit/advanced';
      
      // Extract parameters
      const params = navigationService.extractRouteParameters(pattern, actualPath);
      
      setResults(prev => [
        {
          test: 'Complex Parameters',
          pattern,
          actualPath,
          params,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
      
      toast({
        title: 'Complex parameter extraction complete',
        description: `Extracted ${Object.keys(params || {}).length} parameters from the path`,
      });
    } catch (error) {
      toast({
        title: 'Error testing parameter extraction',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };
  
  // Test circular references
  const testCircularReferences = () => {
    try {
      // Create a mock console.warn function to detect circular references
      const originalWarn = console.warn;
      const mockWarn = mockUtils.fn();
      console.warn = mockWarn;
      
      // Get breadcrumbs for a path that might have circular references
      const breadcrumbs = getBreadcrumbPath(testPath);
      
      // Count warnings about circular references
      const warningCount = mockWarn.mock.calls.length;
      
      // Restore console.warn
      console.warn = originalWarn;
      
      setResults(prev => [
        {
          test: 'Circular References',
          path: testPath,
          warningCount,
          breadcrumbs,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
      
      toast({
        title: 'Circular reference test complete',
        description: `Found ${warningCount} potential circular references in breadcrumb generation`,
      });
    } catch (error) {
      toast({
        title: 'Error testing circular references',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };
  
  // Test cross-role permissions
  const testCrossRolePermissions = () => {
    try {
      // Test all combinations of roles and paths
      const roles: UserRole[] = ['admin', 'writer', 'designer', null];
      const paths = ['/admin/users', '/content/documents', '/design/templates', '/profile'];
      
      const permissionMatrix: Record<string, Record<string, boolean>> = {};
      
      roles.forEach(role => {
        permissionMatrix[role || 'unauthenticated'] = {};
        
        paths.forEach(path => {
          permissionMatrix[role || 'unauthenticated'][path] = 
            navigationService.validateRoute(path, role);
        });
      });
      
      setResults(prev => [
        {
          test: 'Cross-Role Permissions',
          permissionMatrix,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
      
      toast({
        title: 'Cross-role permission test complete',
        description: `Tested ${roles.length * paths.length} role-path combinations`,
      });
    } catch (error) {
      toast({
        title: 'Error testing cross-role permissions',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };
  
  // Run all tests together
  const runAllTests = () => {
    testRouteRelationships();
    testComplexParameters();
    testCircularReferences();
    testCrossRolePermissions();
    
    toast({
      title: 'All route tests completed',
      description: 'Check results tab for details',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Advanced Routing Test Suite</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="config">
          <TabsList className="mb-4">
            <TabsTrigger value="config">Test Configuration</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="config" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="testPath" className="text-sm font-medium">Test Route Path</label>
                <Input 
                  id="testPath"
                  value={testPath}
                  onChange={(e) => setTestPath(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="testRole" className="text-sm font-medium">User Role</label>
                <Select 
                  value={testRole as string} 
                  onValueChange={(value) => setTestRole(value as UserRole)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="writer">Writer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="null">Unauthenticated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-4">
              <Button onClick={testRouteRelationships}>Test Route Relationships</Button>
              <Button onClick={testComplexParameters}>Test Complex Parameters</Button>
              <Button onClick={testCircularReferences}>Test Circular References</Button>
              <Button onClick={testCrossRolePermissions}>Test Role Permissions</Button>
              <Button onClick={runAllTests} variant="default">Run All Tests</Button>
              <Button onClick={() => setResults([])} variant="outline">Clear Results</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            <div className="border rounded-md overflow-auto max-h-96">
              {results.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  No test results yet. Run a test to see results.
                </div>
              ) : (
                <div className="space-y-4 p-4">
                  {results.map((result, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium flex items-center gap-2">
                          {result.test} 
                          <Badge variant="outline">{new Date(result.timestamp).toLocaleTimeString()}</Badge>
                        </h3>
                      </div>
                      
                      <pre className="bg-muted p-2 rounded-md text-xs overflow-auto">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
