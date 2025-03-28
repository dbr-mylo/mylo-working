
import React from 'react';

interface DashboardStatsProps {
  summary: {
    total: number;
    passed: number;
    failed: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ summary }) => {
  return (
    <div className="stats space-x-4">
      <span className="font-medium">Total: {summary.total}</span>
      <span className="text-green-600 font-medium">Passed: {summary.passed}</span>
      <span className="text-red-600 font-medium">Failed: {summary.failed}</span>
    </div>
  );
};
