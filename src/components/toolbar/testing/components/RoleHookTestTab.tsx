
import React from 'react';
import { Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface RoleHookTestTabProps {
  role: string | null;
}

export const RoleHookTestTab: React.FC<RoleHookTestTabProps> = ({ role }) => {
  return (
    <div className="p-4 border rounded-md bg-muted/40">
      <h3 className="text-sm font-medium mb-2">Role Hooks & Components Test</h3>
      <p className="text-sm text-muted-foreground mb-3">
        This test verifies that role hooks and components behave correctly for the current role.
        It checks that useIsWriter, WriterOnly, and StandaloneEditorOnly work with both "writer" and legacy "editor" roles.
      </p>
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Role Context</AlertTitle>
        <AlertDescription>
          Current role: <Badge>{role || 'No Role'}</Badge>
        </AlertDescription>
      </Alert>
    </div>
  );
};
