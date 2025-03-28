
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { TestResult } from '../hooks/useToolbarTestResult';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TestPerformanceMetricsProps {
  testResults: Record<string, TestResult>;
}

interface PerformanceData {
  name: string;
  duration?: number;
  status: 'passed' | 'failed';
  category?: string;
}

export const TestPerformanceMetrics: React.FC<TestPerformanceMetricsProps> = ({ testResults }) => {
  const performanceData = useMemo(() => {
    return Object.entries(testResults)
      .filter(([_, result]) => result.timestamp) // Only include tests with timestamp
      .map(([id, result]) => {
        // Extract operation and category from test ID (e.g., 'editor.insertText' → category: 'editor', operation: 'insertText')
        const parts = id.split('.');
        const category = parts[0] || 'unknown';
        const operation = parts.length > 1 ? parts[parts.length - 1] : id;
        
        // For a real implementation, you would calculate durations between timestamps
        // Here we'll simulate with random durations for demonstration
        const randomDuration = Math.floor(Math.random() * 100) + 10;
        
        return {
          name: result.name || operation,
          duration: randomDuration, // In a real app, this would be a measured duration
          status: result.passed ? 'passed' : 'failed',
          category
        } as PerformanceData;
      })
      .sort((a, b) => (b.duration || 0) - (a.duration || 0));
  }, [testResults]);

  // Group performance data by category
  const categorizedData = useMemo(() => {
    const groupedData: Record<string, PerformanceData[]> = {};
    
    performanceData.forEach(data => {
      const category = data.category || 'unknown';
      if (!groupedData[category]) {
        groupedData[category] = [];
      }
      groupedData[category].push(data);
    });
    
    return groupedData;
  }, [performanceData]);

  if (performanceData.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">No performance data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium mb-2">Operation Performance</h3>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={performanceData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Duration (ms)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value) => [`${value} ms`, 'Duration']}
              labelFormatter={(label) => `Operation: ${label}`}
            />
            <Legend />
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
      
      {/* Category breakdown */}
      <div className="mt-8">
        <h3 className="text-sm font-medium mb-4">Performance by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(categorizedData).map(([category, categoryData]) => {
            const avgTime = Math.round(
              categoryData.reduce((sum, item) => sum + (item.duration || 0), 0) / categoryData.length
            );
            const passRate = Math.round(
              (categoryData.filter(item => item.status === 'passed').length / categoryData.length) * 100
            );
            
            return (
              <Card key={category} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm capitalize">{category}</CardTitle>
                    <Badge variant={passRate === 100 ? "outline" : "secondary"} 
                      className={passRate === 100 ? "border-green-500 text-green-500" : ""}>
                      {passRate}% Pass
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="px-4 py-2 flex justify-between text-xs">
                    <span>Operations: {categoryData.length}</span>
                    <span>Avg: {avgTime}ms</span>
                  </div>
                  <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={categoryData}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                        barSize={8}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="name" tick={{fontSize: 10}} />
                        <YAxis tick={{fontSize: 10}} />
                        <Tooltip 
                          formatter={(value) => [`${value} ms`, 'Duration']}
                          contentStyle={{fontSize: '12px'}}
                        />
                        <Bar dataKey="duration" name="Duration (ms)">
                          {categoryData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.status === 'passed' ? '#10b981' : '#ef4444'} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
