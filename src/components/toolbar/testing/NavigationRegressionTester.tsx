
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { navigationService } from '@/services/navigation/NavigationService';
import { UserRole } from '@/utils/navigation/types';

/**
 * Component for testing navigation service functionality
 */
export const NavigationRegressionTester: React.FC = () => {
  const { toast } = useToast();
  const [sourcePath, setSourcePath] = useState('/');
  const [targetPath, setTargetPath] = useState('/dashboard');
  const [userRole, setUserRole] = useState<UserRole>('writer');
  const [results, setResults] = useState<any[]>([]);
  
  const roles: UserRole[] = ['writer', 'designer', 'admin', null];
  
  // Test route validation
  const testRouteValidation = () => {
    try {
      const isValid = navigationService.validateRoute(targetPath, userRole);
      
      setResults(prev => [
        {
          test: 'Route Validation',
          path: targetPath,
          role: userRole,
          result: isValid ? 'Valid' : 'Invalid',
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
      
      toast({
        title: `Route validation result: ${isValid ? 'Valid' : 'Invalid'}`,
        description: `Path: ${targetPath}, Role: ${userRole || 'unauthenticated'}`,
      });
    } catch (error) {
      toast({
        title: 'Error testing route validation',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };
  
  // Test navigation event logging
  const testNavigationLogging = () => {
    try {
      navigationService.logNavigationEvent(
        sourcePath,
        targetPath,
        true,
        userRole
      );
      
      const history = navigationService.getRecentNavigationHistory(1);
      
      setResults(prev => [
        {
          test: 'Navigation Logging',
          from: sourcePath,
          to: targetPath,
          success: true,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
      
      toast({
        title: 'Navigation event logged',
        description: `From: ${sourcePath}, To: ${targetPath}`,
      });
    } catch (error) {
      toast({
        title: 'Error logging navigation',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };
  
  // Test route parameters extraction
  const testParameterExtraction = () => {
    try {
      const definedPath = '/editor/:documentId';
      const documentId = Math.floor(Math.random() * 1000);
      const actualPath = `/editor/${documentId}`;
      
      const params = navigationService.extractRouteParameters(definedPath, actualPath);
      
      setResults(prev => [
        {
          test: 'Parameter Extraction',
          definedPath,
          actualPath,
          params,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
      
      toast({
        title: 'Parameter extraction result',
        description: `DocumentId: ${params?.documentId || 'Not extracted'}`,
      });
    } catch (error) {
      toast({
        title: 'Error extracting parameters',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };
  
  // Test role transition
  const testRoleTransition = () => {
    try {
      const previousRole = userRole;
      const newRole: UserRole = userRole === 'admin' ? 'writer' : 
                               userRole === 'writer' ? 'designer' : 'admin';
      
      const redirectPath = navigationService.handleRoleTransition(previousRole, newRole);
      
      setResults(prev => [
        {
          test: 'Role Transition',
          from: previousRole,
          to: newRole,
          redirectPath,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
      
      setUserRole(newRole);
      
      toast({
        title: 'Role transition',
        description: `From: ${previousRole || 'unauthenticated'}, To: ${newRole || 'unauthenticated'}, Redirect: ${redirectPath}`,
      });
    } catch (error) {
      toast({
        title: 'Error during role transition',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };
  
  // Run all tests
  const runAllTests = () => {
    testRouteValidation();
    testNavigationLogging();
    testParameterExtraction();
    testRoleTransition();
    
    toast({
      title: 'All tests completed',
      description: 'Check results tab for details',
    });
  };
  
  // Clear results
  const clearResults = () => {
    setResults([]);
    toast({
      title: 'Results cleared',
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Navigation Service Regression Tester</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="input">
          <TabsList className="mb-4">
            <TabsTrigger value="input">Test Input</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="sourcePath" className="text-sm font-medium">Source Path</label>
                <Input 
                  id="sourcePath"
                  value={sourcePath}
                  onChange={(e) => setSourcePath(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="targetPath" className="text-sm font-medium">Target Path</label>
                <Input 
                  id="targetPath"
                  value={targetPath}
                  onChange={(e) => setTargetPath(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="userRole" className="text-sm font-medium">User Role</label>
              <Select 
                value={userRole as string} 
                onValueChange={(value) => setUserRole(value as UserRole)}
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
            
            <div className="flex flex-wrap gap-2 pt-4">
              <Button onClick={testRouteValidation}>Test Route Validation</Button>
              <Button onClick={testNavigationLogging}>Test Navigation Logging</Button>
              <Button onClick={testParameterExtraction}>Test Parameter Extraction</Button>
              <Button onClick={testRoleTransition}>Test Role Transition</Button>
              <Button onClick={runAllTests} variant="default">Run All Tests</Button>
              <Button onClick={clearResults} variant="outline">Clear Results</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 text-left">Test</th>
                    <th className="p-2 text-left">Details</th>
                    <th className="p-2 text-left">Result</th>
                    <th className="p-2 text-left">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                      <td className="p-2">{result.test}</td>
                      <td className="p-2">
                        {result.path && <div>Path: {result.path}</div>}
                        {result.from && <div>From: {result.from}</div>}
                        {result.to && <div>To: {result.to}</div>}
                        {result.role && <div>Role: {result.role}</div>}
                        {result.definedPath && <div>Pattern: {result.definedPath}</div>}
                        {result.actualPath && <div>Actual: {result.actualPath}</div>}
                        {result.redirectPath && <div>Redirect: {result.redirectPath}</div>}
                      </td>
                      <td className="p-2">
                        {result.result && <span className={result.result === 'Valid' ? 'text-green-500' : 'text-red-500'}>{result.result}</span>}
                        {result.params && <pre className="text-xs">{JSON.stringify(result.params, null, 2)}</pre>}
                        {result.success !== undefined && (
                          <span className={result.success ? 'text-green-500' : 'text-red-500'}>
                            {result.success ? 'Success' : 'Failed'}
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-xs text-muted-foreground">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                  {results.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-muted-foreground">
                        No test results yet. Run a test to see results.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
