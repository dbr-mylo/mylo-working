
import React from 'react';
import { Info } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface AccessAlertProps {
  isAdmin: boolean;
  isDevelopment: boolean;
}

export const AccessAlert: React.FC<AccessAlertProps> = ({ isAdmin, isDevelopment }) => {
  if (isAdmin || isDevelopment) return null;
  
  return (
    <Alert className="mb-4">
      <Info className="h-4 w-4" />
      <AlertTitle>Limited Access</AlertTitle>
      <AlertDescription>
        Some test actions are restricted in production for non-admin users.
      </AlertDescription>
    </Alert>
  );
};
