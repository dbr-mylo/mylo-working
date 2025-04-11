
import React from 'react';
import { RecoveryMetricsDashboard } from '../RecoveryMetricsDashboard';

export const RecoveryMetricsPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Recovery Metrics</h1>
      <RecoveryMetricsDashboard />
    </div>
  );
};
