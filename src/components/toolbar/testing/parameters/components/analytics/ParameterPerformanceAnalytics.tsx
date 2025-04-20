import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DonutChart } from '@/components/ui/donut-chart';
import { getParameterCacheMetrics } from '@/utils/navigation/parameters/memoizedParameterHandler';

interface PerformanceData {
  operationName: string;
  executionTime: number;
  timestamp: number;
}

interface ParameterPerformanceAnalyticsProps {
  performanceHistory: PerformanceData[];
  currentExtractionTime?: number;
  currentValidationTime?: number;
  memoizedExtractionTime?: number;
  memoizedValidationTime?: number;
}

export const ParameterPerformanceAnalytics: React.FC<ParameterPerformanceAnalyticsProps> = ({
  performanceHistory = [],
  currentExtractionTime,
  currentValidationTime,
  memoizedExtractionTime,
  memoizedValidationTime
}) => {
  // Get cache metrics
  const cacheMetrics = getParameterCacheMetrics();
  
  // Calculate cache efficiency
  const extractionHitRate = cacheMetrics.extraction.hits + cacheMetrics.extraction.misses > 0 ? 
    (cacheMetrics.extraction.hits / (cacheMetrics.extraction.hits + cacheMetrics.extraction.misses)) * 100 : 0;
  
  const validationHitRate = cacheMetrics.validation.hits + cacheMetrics.validation.misses > 0 ?
    (cacheMetrics.validation.hits / (cacheMetrics.validation.hits + cacheMetrics.validation.misses)) * 100 : 0;
  
  // Group performance data by operation name
  const operationAverages = performanceHistory.reduce((acc, item) => {
    if (!acc[item.operationName]) {
      acc[item.operationName] = {
        operationName: item.operationName,
        totalTime: 0,
        count: 0,
        average: 0
      };
    }
    
    acc[item.operationName].totalTime += item.executionTime;
    acc[item.operationName].count++;
    acc[item.operationName].average = acc[item.operationName].totalTime / acc[item.operationName].count;
    
    return acc;
  }, {} as Record<string, { operationName: string; totalTime: number; count: number; average: number }>);
  
  // Convert to array for chart
  const averageData = Object.values(operationAverages);
  
  // Current vs memoized comparison data
  const comparisonData = [
    {
      name: 'Extraction',
      standard: currentExtractionTime || 0,
      memoized: memoizedExtractionTime || 0,
    },
    {
      name: 'Validation',
      standard: currentValidationTime || 0,
      memoized: memoizedValidationTime || 0,
    }
  ];
  
  // Cache metrics for donut chart
  const extractionDonutData = [
    { name: 'Hits', value: cacheMetrics.extraction.hits, color: '#22c55e' },
    { name: 'Misses', value: cacheMetrics.extraction.misses, color: '#f87171' }
  ];
  
  const validationDonutData = [
    { name: 'Hits', value: cacheMetrics.validation.hits, color: '#22c55e' },
    { name: 'Misses', value: cacheMetrics.validation.misses, color: '#f87171' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Standard vs Memoized Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    formatter={(value: any) => [`${typeof value === 'number' ? value.toFixed(2) : value}ms`, '']}
                  />
                  <Legend />
                  <Bar dataKey="standard" name="Standard" fill="#3b82f6" />
                  <Bar dataKey="memoized" name="Memoized" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {currentExtractionTime && memoizedExtractionTime && (
              <div className="mt-2 text-sm text-center">
                <div className="font-medium">Performance Improvement</div>
                <div>
                  {currentExtractionTime > 0 ? 
                    `${((currentExtractionTime - memoizedExtractionTime) / currentExtractionTime * 100).toFixed(1)}%` 
                    : '0%'} faster with memoization
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Operation Times</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={averageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="operationName" tick={{ fontSize: 10 }} />
                  <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value) => [`${Number(value).toFixed(2)}ms`, '']}
                  />
                  <Bar 
                    dataKey="average" 
                    fill="#8884d8" 
                    name="Average Execution Time" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Extraction Cache Efficiency</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-48 w-48">
              <DonutChart data={extractionDonutData} />
            </div>
            <div className="text-sm mt-2 text-center">
              <div className="font-medium">Hit Rate</div>
              <div>{extractionHitRate.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                Cache Size: {cacheMetrics.extraction.size} entries
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Validation Cache Efficiency</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-48 w-48">
              <DonutChart data={validationDonutData} />
            </div>
            <div className="text-sm mt-2 text-center">
              <div className="font-medium">Hit Rate</div>
              <div>{validationHitRate.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                Cache Size: {cacheMetrics.validation.size} entries
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
