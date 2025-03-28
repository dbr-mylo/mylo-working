
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TestResult } from '../hooks/useToolbarTestResult';

interface TestPerformanceMetricsProps {
  testResults: Record<string, TestResult>;
}

interface PerformanceData {
  name: string;
  duration?: number;
  status: 'passed' | 'failed';
}

export const TestPerformanceMetrics: React.FC<TestPerformanceMetricsProps> = ({ testResults }) => {
  const performanceData = useMemo(() => {
    return Object.entries(testResults)
      .filter(([_, result]) => result.timestamp) // Only include tests with timestamp
      .map(([id, result]) => {
        // Extract operation from test ID (e.g., 'editor.insertText' → 'insertText')
        const operation = id.includes('.') ? id.split('.').pop() || id : id;
        
        // For a real implementation, you would calculate durations between timestamps
        // Here we'll simulate with random durations for demonstration
        const randomDuration = Math.floor(Math.random() * 100) + 10;
        
        return {
          name: result.name || operation,
          duration: randomDuration, // In a real app, this would be a measured duration
          status: result.passed ? 'passed' : 'failed'
        } as PerformanceData;
      })
      .sort((a, b) => (b.duration || 0) - (a.duration || 0));
  }, [testResults]);

  if (performanceData.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">No performance data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Operation Performance</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={performanceData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Duration (ms)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar 
              dataKey="duration" 
              name="Duration (ms)"
              fill="#10b981" // Default color
            >
              {performanceData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.status === 'passed' ? '#10b981' : '#ef4444'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="border rounded-lg p-4">
          <div className="text-sm font-medium">Average Response Time</div>
          <div className="text-2xl font-bold">
            {Math.round(performanceData.reduce((sum, item) => sum + (item.duration || 0), 0) / performanceData.length)}ms
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm font-medium">Slowest Operation</div>
          <div className="text-xl font-medium">
            {performanceData[0]?.name}
          </div>
          <div className="text-sm text-muted-foreground">
            {performanceData[0]?.duration}ms
          </div>
        </div>
      </div>
    </div>
  );
};
