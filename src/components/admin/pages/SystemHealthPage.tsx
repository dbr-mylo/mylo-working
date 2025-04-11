
import React from 'react';
import { SystemHealthDashboard } from '../SystemHealthDashboard';

export const SystemHealthPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">System Health</h1>
      <SystemHealthDashboard />
    </div>
  );
};
