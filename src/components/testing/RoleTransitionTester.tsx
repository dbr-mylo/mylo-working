
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserRole } from '@/utils/navigation/types';
import { navigationService } from '@/services/navigation/NavigationService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/**
 * Component for testing role transitions and their effect on navigation
 */
export const RoleTransitionTester: React.FC = () => {
  const { role } = useAuth();
  const [selectedSourceRole, setSelectedSourceRole] = useState<UserRole | null>(role);
  const [selectedTargetRole, setSelectedTargetRole] = useState<UserRole | null>(null);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [transitionResults, setTransitionResults] = useState<Array<{
    sourceRole: UserRole | null;
    targetRole: UserRole | null;
    redirectPath: string;
    expectedPaths: string[];
    validPaths: string[];
    invalidPaths: string[];
    timestamp: string;
  }>>([]);

  /**
   * Test a role transition and record results
   */
  const testRoleTransition = () => {
    if (!selectedTargetRole) {
      toast.error("Please select a target role");
      return;
    }

    setIsRunningTest(true);
    
    try {
      // Get the redirect path for this transition
      const redirectPath = navigationService.handleRoleTransition(selectedSourceRole, selectedTargetRole);
      
      // Get suggested routes for the target role
      const suggestions = navigationService.getRoleSuggestedRoutes(selectedTargetRole);
      const expectedPaths = suggestions.map(s => s.path);
      
      // Check which routes are valid for the target role
      const validPaths: string[] = [];
      const invalidPaths: string[] = [];
      
      // Test a selection of common routes
      const commonRoutes = [
        '/',
        '/documents',
        '/editor',
        '/writer-dashboard',
        '/designer-dashboard',
        '/admin',
        '/admin/users',
        '/design/templates',
        '/content/documents'
      ];
      
      commonRoutes.forEach(route => {
        if (navigationService.validateRoute(route, selectedTargetRole)) {
          validPaths.push(route);
        } else {
          invalidPaths.push(route);
        }
      });
      
      // Add results
      const result = {
        sourceRole: selectedSourceRole,
        targetRole: selectedTargetRole,
        redirectPath,
        expectedPaths,
        validPaths,
        invalidPaths,
        timestamp: new Date().toISOString()
      };
      
      setTransitionResults(prev => [result, ...prev]);
      
      toast.success("Role transition test completed", {
        description: `${selectedSourceRole || 'Unauthenticated'} → ${selectedTargetRole}`
      });
    } catch (error) {
      toast.error("Failed to test role transition", {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsRunningTest(false);
    }
  };

  /**
   * Clear test results
   */
  const clearResults = () => {
    setTransitionResults([]);
    toast.info("Test results cleared");
  };
  
  /**
   * Run all possible role transitions
   */
  const runAllTransitions = async () => {
    setIsRunningTest(true);
    toast.info("Testing all role transitions...");
    
    try {
      const roles: Array<UserRole | null> = ['admin', 'designer', 'writer', null];
      
      // Test all possible role combinations
      for (const source of roles) {
        for (const target of roles) {
          if (source !== target) {
            setSelectedSourceRole(source);
            setSelectedTargetRole(target);
            
            // Wait a moment between tests to avoid UI freezes
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Get the redirect path for this transition
            const redirectPath = navigationService.handleRoleTransition(source, target);
            
            // Get routes valid for this role
            const validPaths: string[] = [];
            const invalidPaths: string[] = [];
            
            // Test common routes
            const commonRoutes = [
              '/',
              '/documents',
              '/editor',
              '/writer-dashboard',
              '/designer-dashboard',
              '/admin',
              '/design/templates',
              '/content/documents'
            ];
            
            commonRoutes.forEach(route => {
              if (navigationService.validateRoute(route, target)) {
                validPaths.push(route);
              } else {
                invalidPaths.push(route);
              }
            });
            
            // Expected paths from navigation service
            const suggestions = navigationService.getRoleSuggestedRoutes(target);
            const expectedPaths = suggestions.map(s => s.path);
            
            // Add results
            const result = {
              sourceRole: source,
              targetRole: target,
              redirectPath,
              expectedPaths,
              validPaths,
              invalidPaths,
              timestamp: new Date().toISOString()
            };
            
            setTransitionResults(prev => [result, ...prev]);
          }
        }
      }
      
      toast.success("All role transitions tested", {
        description: `${roles.length * (roles.length - 1)} transitions completed`
      });
    } catch (error) {
      toast.error("Failed to test all transitions", {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsRunningTest(false);
    }
  };
  
  /**
   * Format role for display
   */
  const formatRole = (role: UserRole | null): string => {
    if (role === null) return 'Unauthenticated';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Role Transition Testing</CardTitle>
          <CardDescription>
            Test how navigation and routes are affected when transitioning between user roles
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Source Role</label>
                <Select 
                  value={selectedSourceRole || ''} 
                  onValueChange={(value) => setSelectedSourceRole(value === '' ? null : value as UserRole)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unauthenticated</SelectItem>
                    <SelectItem value="writer">Writer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-center">
                <ArrowRight className="h-6 w-6" />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Target Role</label>
                <Select 
                  value={selectedTargetRole || ''} 
                  onValueChange={(value) => setSelectedTargetRole(value === '' ? null : value as UserRole)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unauthenticated</SelectItem>
                    <SelectItem value="writer">Writer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button onClick={testRoleTransition} disabled={isRunningTest || !selectedTargetRole}>
                  Test Transition
                </Button>
                <Button onClick={runAllTransitions} disabled={isRunningTest} variant="outline">
                  Test All Combinations
                </Button>
                <Button onClick={clearResults} variant="ghost" disabled={isRunningTest || transitionResults.length === 0}>
                  Clear Results
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Current Role</h3>
              <Alert className="mb-4">
                <AlertDescription>
                  Your current role is <Badge variant="outline" className="ml-1">{formatRole(role)}</Badge>
                </AlertDescription>
              </Alert>
              
              <h3 className="text-sm font-medium mb-2">Role Transitions</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This tool simulates role transitions and tests how navigation paths are affected.
              </p>
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="text-sm font-medium mb-4">Test Results</h3>
            
            {transitionResults.length === 0 ? (
              <p className="text-sm text-muted-foreground">No transition tests run yet.</p>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {transitionResults.map((result, index) => (
                  <div key={index} className="border rounded-md p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {formatRole(result.sourceRole)} → {formatRole(result.targetRole)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </Badge>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Redirect Path:</span>
                      <Badge variant="secondary" className="ml-2">{result.redirectPath}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">Valid Paths:</span>
                        <div className="text-xs space-y-1">
                          {result.validPaths.map((path, i) => (
                            <div key={i} className="flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                              <span>{path}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">Invalid Paths:</span>
                        <div className="text-xs space-y-1">
                          {result.invalidPaths.map((path, i) => (
                            <div key={i} className="flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1 text-amber-500" />
                              <span>{path}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleTransitionTester;
