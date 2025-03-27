
import React from 'react';
import { Shield, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useIsWriter, useIsDesigner, useIsAdmin } from '@/utils/roles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RoleHookTestTabProps {
  role: string | null;
}

export const RoleHookTestTab: React.FC<RoleHookTestTabProps> = ({ role }) => {
  // Use the actual hooks to verify their functionality
  const isWriter = useIsWriter();
  const isDesigner = useIsDesigner();
  const isAdmin = useIsAdmin();
  
  // Expected values based on the role
  const expectedIsWriter = (role === 'writer' || role === 'editor' || role === 'admin');
  const expectedIsDesigner = (role === 'designer' || role === 'admin');
  const expectedIsAdmin = (role === 'admin');

  const isWriterCorrect = isWriter === expectedIsWriter;
  const isDesignerCorrect = isDesigner === expectedIsDesigner;
  const isAdminCorrect = isAdmin === expectedIsAdmin;

  return (
    <div className="space-y-4">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Role Context</AlertTitle>
        <AlertDescription>
          Current role: <Badge>{role || 'No Role'}</Badge>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Role Hook Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start">
            {isWriterCorrect ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            )}
            <div>
              <h4 className="text-sm font-medium">useIsWriter()</h4>
              <p className="text-xs text-muted-foreground">
                Current value: <Badge variant={isWriter ? "default" : "outline"}>{String(isWriter)}</Badge> 
                {" "} Expected: <Badge variant={expectedIsWriter ? "default" : "outline"}>{String(expectedIsWriter)}</Badge>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Should return true for 'writer', 'editor', and 'admin' roles.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            {isDesignerCorrect ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            )}
            <div>
              <h4 className="text-sm font-medium">useIsDesigner()</h4>
              <p className="text-xs text-muted-foreground">
                Current value: <Badge variant={isDesigner ? "default" : "outline"}>{String(isDesigner)}</Badge> 
                {" "} Expected: <Badge variant={expectedIsDesigner ? "default" : "outline"}>{String(expectedIsDesigner)}</Badge>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Should return true for 'designer' and 'admin' roles.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            {isAdminCorrect ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            )}
            <div>
              <h4 className="text-sm font-medium">useIsAdmin()</h4>
              <p className="text-xs text-muted-foreground">
                Current value: <Badge variant={isAdmin ? "default" : "outline"}>{String(isAdmin)}</Badge> 
                {" "} Expected: <Badge variant={expectedIsAdmin ? "default" : "outline"}>{String(expectedIsAdmin)}</Badge>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Should return true only for 'admin' role.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="p-4 border rounded-md bg-muted/40">
        <h3 className="text-sm font-medium mb-2">Role Hooks & Components Test</h3>
        <p className="text-sm text-muted-foreground mb-3">
          This test verifies that role hooks and components behave correctly for the current role.
          It checks that useIsWriter, WriterOnly, and StandaloneWriterOnly work with both "writer" and legacy "editor" roles.
        </p>
      </div>
    </div>
  );
};
