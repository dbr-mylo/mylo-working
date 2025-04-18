
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';
import { UserRole } from '@/utils/navigation/types';
import { navigationService } from '@/services/navigation/NavigationService';

interface NavigationTestResult {
  pattern: string;
  actualPath: string;
  role: UserRole;
  isValid: boolean;
  params: Record<string, string> | null;
  timestamp: string;
  error?: string;
}

export const ParameterRouteNavigationTester: React.FC = () => {
  const [routePattern, setRoutePattern] = useState('/content/:contentType/:documentId/version/:versionId');
  const [actualPath, setActualPath] = useState('/content/article/doc-123/version/v2');
  const [selectedRole, setSelectedRole] = useState<UserRole>('writer');
  const [results, setResults] = useState<NavigationTestResult[]>([]);
  
  // Test route validation and parameter extraction
  const testNavigation = () => {
    try {
      // Check if the route is valid for the selected role
      const isValid = navigationService.validateRoute(actualPath, selectedRole);
      
      // Extract parameters from the path
      const params = navigationService.extractRouteParameters(routePattern, actualPath);
      
      // Create result
      const result: NavigationTestResult = {
        pattern: routePattern,
        actualPath,
        role: selectedRole,
        isValid,
        params,
        timestamp: new Date().toISOString()
      };
      
      // Log the navigation event
      navigationService.logNavigationEvent(
        '/previous-path',
        actualPath,
        isValid,
        selectedRole,
        isValid ? undefined : 'Invalid route'
      );
      
      setResults(prev => [result, ...prev]);
    } catch (error) {
      // Handle errors
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      const result: NavigationTestResult = {
        pattern: routePattern,
        actualPath,
        role: selectedRole,
        isValid: false,
        params: null,
        timestamp: new Date().toISOString(),
        error: errorMessage
      };
      
      setResults(prev => [result, ...prev]);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parameter Route Navigation Tester</CardTitle>
        <CardDescription>
          Test parameter extraction with route validation and navigation service
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="route-pattern">Route Pattern</Label>
            <Input 
              id="route-pattern"
              value={routePattern}
              onChange={(e) => setRoutePattern(e.target.value)}
              placeholder="/path/:param1/:param2"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="actual-path">Actual Path</Label>
            <Input
              id="actual-path"
              value={actualPath}
              onChange={(e) => setActualPath(e.target.value)}
              placeholder="/path/value1/value2"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role-select">User Role</Label>
          <Select
            value={selectedRole || ''}
            onValueChange={(value) => setSelectedRole(value as UserRole)}
          >
            <SelectTrigger id="role-select">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="writer">Writer</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="designer">Designer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={testNavigation} className="w-full">
          Test Navigation
        </Button>
        
        {results.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-medium">Test Results</h3>
            
            <div className="border rounded-md overflow-auto max-h-96">
              {results.map((result, index) => (
                <div key={index} className="border-b p-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {result.isValid ? (
                        <CheckCircle className="text-green-500 h-5 w-5" />
                      ) : (
                        <XCircle className="text-red-500 h-5 w-5" />
                      )}
                      <span className={result.isValid ? "text-green-600" : "text-red-600"}>
                        {result.isValid ? "Valid Route" : "Invalid Route"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div><span className="font-medium">Pattern:</span> {result.pattern}</div>
                    <div><span className="font-medium">Path:</span> {result.actualPath}</div>
                    <div><span className="font-medium">Role:</span> {result.role || 'None'}</div>
                    
                    {result.params && (
                      <div className="space-y-1">
                        <div className="font-medium">Extracted Parameters</div>
                        <pre className="bg-muted p-2 rounded-md text-xs overflow-auto">
                          {JSON.stringify(result.params, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {result.error && (
                      <Alert variant="destructive">
                        <AlertDescription>{result.error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
