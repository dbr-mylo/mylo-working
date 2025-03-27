
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const RoleAlert: React.FC = () => {
  return (
    <Alert className="mb-2">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Role-Based Testing</AlertTitle>
      <AlertDescription>
        Change the current role to test how toolbar components behave with different roles.
        The Writer tests should pass when the role is "writer" or "editor" (legacy).
      </AlertDescription>
    </Alert>
  );
};
