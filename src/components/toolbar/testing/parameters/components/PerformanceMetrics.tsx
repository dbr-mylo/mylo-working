
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PerformanceMetrics {
  averageTime: number;
  maxTime: number;
  minTime: number;
  totalTests: number;
  passedTests: number;
}

interface PerformanceMetricsProps {
  metrics: PerformanceMetrics;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  const successRate = (metrics.passedTests / metrics.totalTests) * 100;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Average Time</p>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {metrics.averageTime.toFixed(2)}ms
            </Badge>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">Max Time</p>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
              {metrics.maxTime.toFixed(2)}ms
            </Badge>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">Min Time</p>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {metrics.minTime.toFixed(2)}ms
            </Badge>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">Success Rate</p>
            <Badge 
              variant="outline" 
              className={successRate >= 90 ? 'bg-green-50 text-green-700' : 
                         successRate >= 70 ? 'bg-yellow-50 text-yellow-700' : 
                         'bg-red-50 text-red-700'}
            >
              {successRate.toFixed(1)}%
            </Badge>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">Total Tests</p>
            <Badge variant="outline">
              {metrics.totalTests}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">Passed Tests</p>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {metrics.passedTests}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
