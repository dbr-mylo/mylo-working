
import React from 'react';
import { Shield } from 'lucide-react';
import { CardTitle, CardDescription } from '@/components/ui/card';

interface DashboardHeaderProps {
  role: string | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ role }) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <CardTitle>Smoke Test Dashboard</CardTitle>
        <CardDescription>
          Monitor component render tests across the application
        </CardDescription>
      </div>
      {role && (
        <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-md text-sm">
          <Shield className="h-4 w-4" />
          <span>Role: {role}</span>
        </div>
      )}
    </div>
  );
};
