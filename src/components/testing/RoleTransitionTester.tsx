
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { navigationService } from '@/services/navigation/NavigationService';
import { UserRole } from '@/utils/navigation/types';

/**
 * Component for testing role transitions and access controls
 */
export const RoleTransitionTester: React.FC = () => {
  const { role, setRole } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(role);
  const [transitionResults, setTransitionResults] = useState<Array<{
    from: UserRole | null;
    to: UserRole | null;
    redirectPath: string;
    timestamp: string;
    success: boolean;
  }>>([]);
  const [accessResults, setAccessResults] = useState<Array<{
    role: UserRole | null;
    path: string;
    allowed: boolean;
    timestamp: string;
  }>>([]);
  
  // All available roles
  const availableRoles: Array<UserRole | null> = ['writer', 'designer', 'admin', null];
  
  // Test paths for each role
  const rolePaths: Record<string, string> = {
    writer: '/writer-dashboard',
    designer: '/designer-dashboard',
    admin: '/admin',
    null: '/auth'
  };
  
  /**
   * Test role transition
   */
  const testRoleTransition = () => {
    if (selectedRole === role) {
      toast.warning("Selected role is the same as current role", {
        description: "Please select a different role for transition testing"
      });
      return;
    }
    
    const previousRole = role;
    
    try {
      // Get redirect path from navigation service
      const redirectPath = navigationService.handleRoleTransition(previousRole, selectedRole);
      
      // Apply role change in auth context
      setRole(selectedRole);
      
      // Log the result
      setTransitionResults(prev => [
        {
          from: previousRole,
          to: selectedRole,
          redirectPath,
          timestamp: new Date().toISOString(),
          success: true
        },
        ...prev
      ]);
      
      // Display toast
      toast.success("Role transition successful", {
        description: `Changed role from ${previousRole || 'unauthenticated'} to ${selectedRole || 'unauthenticated'}`
      });
      
      // Navigate to the redirect path if it's valid
      if (redirectPath) {
        navigate(redirectPath);
      }
    } catch (error) {
      // Log failure
      setTransitionResults(prev => [
        {
          from: previousRole,
          to: selectedRole,
          redirectPath: '',
          timestamp: new Date().toISOString(),
          success: false
        },
        ...prev
      ]);
      
      // Display error
      toast.error("Role transition failed", {
        description: error instanceof Error ? error.message : "An error occurred during role transition"
      });
    }
  };
  
  /**
   * Test access control for a specific path
   */
  const testAccessControl = (path: string, testRole: UserRole | null) => {
    const isValid = navigationService.validateRoute(path, testRole);
    
    // Log the result
    setAccessResults(prev => [
      {
        role: testRole,
        path,
        allowed: isValid,
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);
    
    // Display toast
    if (isValid) {
      toast.success("Access allowed", {
        description: `Role ${testRole || 'unauthenticated'} can access ${path}`
      });
    } else {
      toast.error("Access denied", {
        description: `Role ${testRole || 'unauthenticated'} cannot access ${path}`
      });
    }
  };
  
  /**
   * Test access for current role to all paths
   */
  const testCurrentRoleAccess = () => {
    Object.values(rolePaths).forEach(path => {
      testAccessControl(path, role);
    });
  };
  
  /**
   * Test redirection needs after role change
   */
  const testRedirectionNeeds = () => {
    if (!selectedRole) return;
    
    // Test each path for redirection needs
    Object.values(rolePaths).forEach(path => {
      const needsRedirect = navigationService.needsRedirect(path, selectedRole);
      
      setAccessResults(prev => [
        {
          role: selectedRole,
          path,
          allowed: !needsRedirect,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
    });
    
    toast.info("Redirection test complete", {
      description: "Check the access results table for details"
    });
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
              <Badge variant="outline" className="text-sm">
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
            
            <Button onClick={testRoleTransition} className="mt-auto">
              Test Role Transition
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={testCurrentRoleAccess} variant="outline" size="sm">
              Test Current Role Access
            </Button>
            <Button onClick={testRedirectionNeeds} variant="outline" size="sm">
              Test Redirection Needs
            </Button>
            <Button onClick={clearResults} variant="ghost" size="sm">
              Clear Results
            </Button>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Transition Results</h3>
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
                    <TableRow key={index}>
                      <TableCell>{result.from || 'unauthenticated'}</TableCell>
                      <TableCell>{result.to || 'unauthenticated'}</TableCell>
                      <TableCell>{result.redirectPath || '-'}</TableCell>
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
              <div className="text-center text-muted-foreground p-4 border rounded-md">
                No transition tests run yet
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Access Control Results</h3>
            {accessResults.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Access</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>{result.role || 'unauthenticated'}</TableCell>
                      <TableCell className="font-mono text-xs">{result.path}</TableCell>
                      <TableCell>
                        <Badge variant={result.allowed ? "default" : "destructive"} className={result.allowed ? "bg-green-500 hover:bg-green-600" : undefined}>
                          {result.allowed ? 'Allowed' : 'Denied'}
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
              <div className="text-center text-muted-foreground p-4 border rounded-md">
                No access control tests run yet
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
