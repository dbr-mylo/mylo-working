
import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Info, Play } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  useIsWriter, 
  useIsDesigner, 
  useIsAdmin, 
  useIsWriterOrAdmin,
  useIsDesignerOrAdmin,
  useRoleSpecificValue,
  useHasAnyRole,
  useCanManageTemplates,
  WriterOnly,
  DesignerOnly,
  AdminOnly,
  WriterOrAdminOnly,
  DesignerOrAdminOnly
} from '@/utils/roles';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RoleHookTestTabProps {
  role: string | null;
}

export const RoleHookTestTab: React.FC<RoleHookTestTabProps> = ({ role }) => {
  const [activeTab, setActiveTab] = useState("hooks");
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  
  // Use the actual hooks to verify their functionality
  const isWriter = useIsWriter();
  const isDesigner = useIsDesigner();
  const isAdmin = useIsAdmin();
  const isWriterOrAdmin = useIsWriterOrAdmin();
  const isDesignerOrAdmin = useIsDesignerOrAdmin();
  const canManageTemplates = useCanManageTemplates();
  const hasWriterRole = useHasAnyRole(['writer']);
  const hasDesignerRole = useHasAnyRole(['designer']);
  const roleValue = useRoleSpecificValue('designer-value', 'writer-value', 'admin-value');
  
  // Expected values based on the role
  const expectedIsWriter = (role === 'writer' || role === 'editor' || role === 'admin');
  const expectedIsDesigner = (role === 'designer' || role === 'admin');
  const expectedIsAdmin = (role === 'admin');
  const expectedIsWriterOrAdmin = (role === 'writer' || role === 'editor' || role === 'admin');
  const expectedIsDesignerOrAdmin = (role === 'designer' || role === 'admin');

  const runAllTests = () => {
    const results: Record<string, any> = {
      'useIsWriter': {
        passed: isWriter === expectedIsWriter,
        actual: isWriter,
        expected: expectedIsWriter,
        message: isWriter === expectedIsWriter 
          ? "Writer role detection working correctly" 
          : "Writer role detection failed"
      },
      'useIsDesigner': {
        passed: isDesigner === expectedIsDesigner,
        actual: isDesigner,
        expected: expectedIsDesigner,
        message: isDesigner === expectedIsDesigner 
          ? "Designer role detection working correctly" 
          : "Designer role detection failed"
      },
      'useIsAdmin': {
        passed: isAdmin === expectedIsAdmin,
        actual: isAdmin,
        expected: expectedIsAdmin,
        message: isAdmin === expectedIsAdmin 
          ? "Admin role detection working correctly" 
          : "Admin role detection failed"
      },
      'useIsWriterOrAdmin': {
        passed: isWriterOrAdmin === expectedIsWriterOrAdmin,
        actual: isWriterOrAdmin,
        expected: expectedIsWriterOrAdmin,
        message: isWriterOrAdmin === expectedIsWriterOrAdmin 
          ? "Writer or Admin role detection working correctly" 
          : "Writer or Admin role detection failed"
      },
      'useIsDesignerOrAdmin': {
        passed: isDesignerOrAdmin === expectedIsDesignerOrAdmin,
        actual: isDesignerOrAdmin,
        expected: expectedIsDesignerOrAdmin,
        message: isDesignerOrAdmin === expectedIsDesignerOrAdmin 
          ? "Designer or Admin role detection working correctly" 
          : "Designer or Admin role detection failed"
      },
      'useHasAnyRole-writer': {
        passed: hasWriterRole === (role === 'writer' || role === 'editor'),
        actual: hasWriterRole,
        expected: (role === 'writer' || role === 'editor'),
        message: hasWriterRole === (role === 'writer' || role === 'editor')
          ? "hasAnyRole(['writer']) working correctly" 
          : "hasAnyRole(['writer']) failed"
      },
      'useHasAnyRole-designer': {
        passed: hasDesignerRole === (role === 'designer'),
        actual: hasDesignerRole,
        expected: (role === 'designer'),
        message: hasDesignerRole === (role === 'designer')
          ? "hasAnyRole(['designer']) working correctly" 
          : "hasAnyRole(['designer']) failed"
      },
      'useRoleSpecificValue': {
        passed: (
          (role === 'designer' && roleValue === 'designer-value') ||
          ((role === 'writer' || role === 'editor') && roleValue === 'writer-value') ||
          (role === 'admin' && roleValue === 'admin-value') ||
          (role === null && roleValue === 'writer-value')
        ),
        actual: roleValue,
        expected: role === 'designer' ? 'designer-value' : 
                 (role === 'writer' || role === 'editor') ? 'writer-value' : 
                 role === 'admin' ? 'admin-value' : 'writer-value',
        message: "Role specific value test"
      },
      'useCanManageTemplates': {
        passed: canManageTemplates === (role === 'designer' || role === 'admin'),
        actual: canManageTemplates,
        expected: (role === 'designer' || role === 'admin'),
        message: canManageTemplates === (role === 'designer' || role === 'admin')
          ? "canManageTemplates working correctly" 
          : "canManageTemplates failed"
      }
    };
    
    setTestResults(results);
  };

  useEffect(() => {
    // Reset results when role changes
    setTestResults({});
  }, [role]);

  return (
    <div className="space-y-4">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Role Context</AlertTitle>
        <AlertDescription>
          Current role: <Badge>{role || 'No Role'}</Badge>
        </AlertDescription>
      </Alert>

      <div className="flex justify-end mb-2">
        <Button onClick={runAllTests} size="sm" className="gap-1">
          <Play className="h-4 w-4" /> Run All Tests
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="hooks">Role Hooks</TabsTrigger>
          <TabsTrigger value="components">Role Components</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hooks" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Role Hook Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.keys(testResults).length > 0 ? (
                Object.entries(testResults).map(([testName, result]) => (
                  <div key={testName} className="flex items-start border-b pb-2 last:border-b-0 last:pb-0">
                    {result.passed ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <h4 className="text-sm font-medium">{testName}</h4>
                      <p className="text-xs text-muted-foreground">
                        {result.message}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          Expected: {String(result.expected)}
                        </Badge>
                        <Badge 
                          variant={result.passed ? "default" : "destructive"} 
                          className="text-xs"
                        >
                          Actual: {String(result.actual)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  <Info className="h-5 w-5 mx-auto mb-2" />
                  <p>Click "Run All Tests" to test the role hooks</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="components" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Role Component Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">WriterOnly Component</h3>
                <div className="border rounded-md p-3">
                  <WriterOnly>
                    <div className="bg-green-100 p-2 rounded text-sm">
                      This content is visible for Writer role ({role === 'writer' || role === 'editor' || role === 'admin' ? 'CORRECT ✓' : 'INCORRECT ✗'})
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Should be visible for 'writer', 'editor', and 'admin' roles.
                    </div>
                  </WriterOnly>
                  <WriterOnly fallback={
                    <div className="bg-red-100 p-2 rounded text-sm">
                      Writer-only content is hidden ({role !== 'writer' && role !== 'editor' && role !== 'admin' ? 'CORRECT ✓' : 'INCORRECT ✗'})
                    </div>
                  } />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">DesignerOnly Component</h3>
                <div className="border rounded-md p-3">
                  <DesignerOnly>
                    <div className="bg-green-100 p-2 rounded text-sm">
                      This content is visible for Designer role ({role === 'designer' || role === 'admin' ? 'CORRECT ✓' : 'INCORRECT ✗'})
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Should be visible for 'designer' and 'admin' roles.
                    </div>
                  </DesignerOnly>
                  <DesignerOnly fallback={
                    <div className="bg-red-100 p-2 rounded text-sm">
                      Designer-only content is hidden ({role !== 'designer' && role !== 'admin' ? 'CORRECT ✓' : 'INCORRECT ✗'})
                    </div>
                  } />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">AdminOnly Component</h3>
                <div className="border rounded-md p-3">
                  <AdminOnly>
                    <div className="bg-green-100 p-2 rounded text-sm">
                      This content is visible for Admin role ({role === 'admin' ? 'CORRECT ✓' : 'INCORRECT ✗'})
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Should be visible only for 'admin' role.
                    </div>
                  </AdminOnly>
                  <AdminOnly fallback={
                    <div className="bg-red-100 p-2 rounded text-sm">
                      Admin-only content is hidden ({role !== 'admin' ? 'CORRECT ✓' : 'INCORRECT ✗'})
                    </div>
                  } />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Combined Role Components</h3>
                <div className="border rounded-md p-3">
                  <WriterOrAdminOnly>
                    <div className="bg-green-100 p-2 rounded text-sm">
                      This content is visible for Writer or Admin roles ({(role === 'writer' || role === 'editor' || role === 'admin') ? 'CORRECT ✓' : 'INCORRECT ✗'})
                    </div>
                  </WriterOrAdminOnly>
                  
                  <DesignerOrAdminOnly>
                    <div className="bg-blue-100 p-2 rounded text-sm mt-2">
                      This content is visible for Designer or Admin roles ({(role === 'designer' || role === 'admin') ? 'CORRECT ✓' : 'INCORRECT ✗'})
                    </div>
                  </DesignerOrAdminOnly>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="p-4 border rounded-md bg-muted/40">
        <h3 className="text-sm font-medium mb-2">Role Hooks & Components Test</h3>
        <p className="text-sm text-muted-foreground mb-3">
          This test verifies that role hooks and components behave correctly for the current role.
          It checks that all hooks properly support both "writer" and legacy "editor" roles,
          and that components render correctly based on the user's role.
        </p>
      </div>
    </div>
  );
};
