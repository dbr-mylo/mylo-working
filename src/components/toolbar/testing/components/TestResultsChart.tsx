
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TestResult } from '../hooks/useToolbarTestResult';

interface TestResultsChartProps {
  testResults: Record<string, TestResult>;
}

export const TestResultsChart: React.FC<TestResultsChartProps> = ({ testResults }) => {
  const chartData = useMemo(() => {
    const passedTests = Object.values(testResults).filter(r => r.passed).length;
    const failedTests = Object.values(testResults).length - passedTests;
    
    return [
      { name: 'Passed', value: passedTests, color: '#10b981' },
      { name: 'Failed', value: failedTests, color: '#ef4444' }
    ].filter(item => item.value > 0);
  }, [testResults]);

  if (Object.keys(testResults).length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">No test data available</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} tests`, '']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
