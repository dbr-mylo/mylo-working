
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { navigationService } from '@/services/navigation/NavigationService';
import { UserRole } from '@/utils/navigation/types';
import { Loader2, ShieldCheck, ShieldAlert, ArrowRightLeft, AlertCircle } from 'lucide-react';

type TransitionResult = {
  from: UserRole | null;
  to: UserRole | null;
  redirectPath: string;
  timestamp: string;
  success: boolean;
  message?: string;
};

type AccessResult = {
  role: UserRole | null;
  path: string;
  allowed: boolean;
  timestamp: string;
  redirectPath?: string;
  message?: string;
};

/**
 * Component for testing role transitions and access controls
 */
export const RoleTransitionTester: React.FC = () => {
  const { role, setRole } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(role);
  const [transitionResults, setTransitionResults] = useState<TransitionResult[]>([]);
  const [accessResults, setAccessResults] = useState<AccessResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('transitions');
  
  // All available roles
  const availableRoles: Array<UserRole | null> = ['writer', 'designer', 'admin', null];
  
  // Test paths for each role
  const rolePaths: Record<string, string> = {
    writer: '/writer-dashboard',
    designer: '/designer-dashboard',
    admin: '/admin',
    null: '/auth'
  };

  // Update selected role when actual role changes
  useEffect(() => {
    setSelectedRole(role);
  }, [role]);
  
  /**
   * Test role transition
   */
  const testRoleTransition = async () => {
    if (selectedRole === role) {
      toast.warning("Selected role is the same as current role", {
        description: "Please select a different role for transition testing"
      });
      return;
    }
    
    setIsLoading(true);
    const previousRole = role;
    
    try {
      // Get redirect path from navigation service
      const redirectPath = navigationService.handleRoleTransition(previousRole, selectedRole);
      
      // Apply role change in auth context
      setRole(selectedRole);
      
      // Log the result
      const result: TransitionResult = {
        from: previousRole,
        to: selectedRole,
        redirectPath,
        timestamp: new Date().toISOString(),
        success: true,
        message: `Successfully transitioned from ${previousRole || 'unauthenticated'} to ${selectedRole || 'unauthenticated'}`
      };
      
      setTransitionResults(prev => [result, ...prev]);
      
      // Display toast
      toast.success("Role transition successful", {
        description: `Changed role from ${previousRole || 'unauthenticated'} to ${selectedRole || 'unauthenticated'}`
      });
      
      // Navigate to the redirect path if it's valid
      if (redirectPath) {
        // For testing purposes, we'll just show where it would redirect
        toast.info(`Would redirect to: ${redirectPath}`, {
          description: "Navigation not performed in test mode"
        });
      }
    } catch (error) {
      // Log failure
      const result: TransitionResult = {
        from: previousRole,
        to: selectedRole,
        redirectPath: '',
        timestamp: new Date().toISOString(),
        success: false,
        message: error instanceof Error ? error.message : "An error occurred during role transition"
      };
      
      setTransitionResults(prev => [result, ...prev]);
      
      // Display error
      toast.error("Role transition failed", {
        description: result.message
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Test access control for a specific path
   */
  const testAccessControl = (path: string, testRole: UserRole | null) => {
    const isValid = navigationService.validateRoute(path, testRole);
    
    // Log the result
    const result: AccessResult = {
      role: testRole,
      path,
      allowed: isValid,
      timestamp: new Date().toISOString(),
      message: isValid 
        ? `Role ${testRole || 'unauthenticated'} can access ${path}`
        : `Role ${testRole || 'unauthenticated'} cannot access ${path}`
    };
    
    setAccessResults(prev => [result, ...prev]);
    
    // Display toast
    if (isValid) {
      toast.success("Access allowed", {
        description: result.message
      });
    } else {
      toast.error("Access denied", {
        description: result.message
      });
    }
    
    return result;
  };
  
  /**
   * Test access for current role to all paths
   */
  const testCurrentRoleAccess = async () => {
    setIsLoading(true);
    const results: AccessResult[] = [];
    
    try {
      toast.info("Testing access control for all paths...");
      
      // Test each path for the current role
      for (const [roleName, path] of Object.entries(rolePaths)) {
        const result = testAccessControl(path, role);
        results.push(result);
        await new Promise(resolve => setTimeout(resolve, 300)); // Small delay for UI
      }
      
      toast.success("Access control tests completed");
    } catch (error) {
      toast.error("Error testing access control", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Test redirection needs after role change
   */
  const testRedirectionNeeds = async () => {
    if (!selectedRole) {
      toast.warning("No role selected", {
        description: "Please select a role to test redirection needs"
      });
      return;
    }
    
    setIsLoading(true);
    const results: AccessResult[] = [];
    
    try {
      toast.info("Testing redirection needs...");
      
      // Test each path for redirection needs
      for (const [roleName, path] of Object.entries(rolePaths)) {
        const needsRedirect = navigationService.needsRedirect(path, selectedRole);
        const redirectPath = needsRedirect ? navigationService.getFallbackRoute(selectedRole) : undefined;
        
        const result: AccessResult = {
          role: selectedRole,
          path,
          allowed: !needsRedirect,
          timestamp: new Date().toISOString(),
          redirectPath: redirectPath,
          message: needsRedirect 
            ? `${selectedRole || 'Unauthenticated'} needs redirect from ${path} to ${redirectPath}`
            : `${selectedRole || 'Unauthenticated'} can stay on ${path}`
        };
        
        results.push(result);
        setAccessResults(prev => [result, ...prev]);
        await new Promise(resolve => setTimeout(resolve, 300)); // Small delay for UI
      }
      
      toast.success("Redirection tests completed");
      
      // Switch to access tab to show results
      setActiveTab('access');
    } catch (error) {
      toast.error("Error testing redirections", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Test all role transitions
   */
  const testAllTransitions = async () => {
    setIsLoading(true);
    
    try {
      toast.info("Testing all role transitions...");
      const currentRole = role;
      
      // Test transitions to all roles
      for (const targetRole of availableRoles) {
        if (targetRole === role) continue; // Skip current role
        
        const redirectPath = navigationService.handleRoleTransition(role, targetRole);
        
        // Apply role change in auth context but revert immediately
        setRole(targetRole);
        await new Promise(resolve => setTimeout(resolve, 500)); // Brief delay to show change
        
        const result: TransitionResult = {
          from: role,
          to: targetRole,
          redirectPath,
          timestamp: new Date().toISOString(),
          success: true,
          message: `Test transition from ${role || 'unauthenticated'} to ${targetRole || 'unauthenticated'}`
        };
        
        setTransitionResults(prev => [result, ...prev]);
      }
      
      // Restore original role
      setRole(currentRole);
      
      toast.success("All transitions tested", {
        description: "Original role has been restored"
      });
      
      // Switch to transitions tab to show results
      setActiveTab('transitions');
    } catch (error) {
      toast.error("Error testing transitions", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
      
      // Try to restore original role in case of error
      setRole(role);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Clear all test results
   */
  const clearResults = () => {
    setTransitionResults([]);
    setAccessResults([]);
    toast("Results cleared");
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Role Transition Tester</CardTitle>
        <CardDescription>
          Test role transitions, access control, and navigation behavior
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted/30 rounded-md space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <div className="text-sm font-medium mb-1">Current Role:</div>
              <Badge variant="outline" className="text-sm bg-blue-50 border-blue-200">
                {role || 'unauthenticated'}
              </Badge>
            </div>
            
            <div className="flex-grow">
              <div className="text-sm font-medium mb-1">Target Role:</div>
              <Select 
                value={selectedRole || 'null'} 
                onValueChange={(value) => setSelectedRole(value === 'null' ? null : value as UserRole)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((r) => (
                    <SelectItem key={r || 'null'} value={r || 'null'}>
                      {r || 'unauthenticated'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={testRoleTransition} 
              className="mt-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <ArrowRightLeft className="h-4 w-4 mr-2" />
              )}
              Test Role Transition
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={testCurrentRoleAccess} 
              variant="outline" 
              size="sm" 
              disabled={isLoading}
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              Test Current Role Access
            </Button>
            <Button 
              onClick={testRedirectionNeeds} 
              variant="outline" 
              size="sm"
              disabled={isLoading}
            >
              <ShieldAlert className="h-4 w-4 mr-2" />
              Test Redirection Needs
            </Button>
            <Button 
              onClick={testAllTransitions} 
              variant="outline" 
              size="sm"
              disabled={isLoading}
            >
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Test All Transitions
            </Button>
            <Button 
              onClick={clearResults} 
              variant="ghost" 
              size="sm"
              disabled={isLoading || (transitionResults.length === 0 && accessResults.length === 0)}
            >
              Clear Results
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="transitions">
              Transition Results {transitionResults.length > 0 && `(${transitionResults.length})`}
            </TabsTrigger>
            <TabsTrigger value="access">
              Access Results {accessResults.length > 0 && `(${accessResults.length})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="transitions" className="mt-4">
            <ScrollArea className="h-[300px]">
              {transitionResults.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Redirect Path</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transitionResults.map((result, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell>{result.from || 'unauthenticated'}</TableCell>
                        <TableCell>{result.to || 'unauthenticated'}</TableCell>
                        <TableCell className="font-mono text-xs">{result.redirectPath || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={result.success ? "default" : "destructive"} className={result.success ? "bg-green-500 hover:bg-green-600" : undefined}>
                            {result.success ? 'Success' : 'Failed'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-muted-foreground p-6 border rounded-md">
                  No transition tests run yet. Use the controls above to test role transitions.
                </div>
              )}
            </ScrollArea>
            
            {transitionResults.length > 0 && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>About Transitions</AlertTitle>
                <AlertDescription>
                  Role transitions trigger navigation events to ensure users are directed to appropriate pages
                  based on their new permissions. The redirect paths shown are where users would be sent after
                  a role change.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="access" className="mt-4">
            <ScrollArea className="h-[300px]">
              {accessResults.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Path</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead>Redirect</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessResults.map((result, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell>{result.role || 'unauthenticated'}</TableCell>
                        <TableCell className="font-mono text-xs">{result.path}</TableCell>
                        <TableCell>
                          <Badge variant={result.allowed ? "default" : "destructive"} className={result.allowed ? "bg-green-500 hover:bg-green-600" : undefined}>
                            {result.allowed ? 'Allowed' : 'Denied'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {result.redirectPath || '-'}
                        </TableCell>
                        <TableCell className="text-xs">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-muted-foreground p-6 border rounded-md">
                  No access control tests run yet. Use the controls above to test role-based access.
                </div>
              )}
            </ScrollArea>
            
            {accessResults.length > 0 && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>About Access Control</AlertTitle>
                <AlertDescription>
                  Access control determines which routes a user can visit based on their role.
                  When access is denied, users are redirected to appropriate fallback routes or
                  error pages.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RoleTransitionTester;
