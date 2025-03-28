
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TestItem } from '../hooks/usePersistentTestResults';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface TestDashboardProps {
  testItems: TestItem[];
}

export const TestDashboard: React.FC<TestDashboardProps> = ({ testItems }) => {
  // Calculate test statistics
  const total = testItems.length;
  const passed = testItems.filter(test => test.status === 'passed').length;
  const failed = testItems.filter(test => test.status === 'failed').length;
  const untested = testItems.filter(test => test.status === 'untested').length;
  
  // Calculate percentages
  const passedPercentage = total > 0 ? Math.round((passed / total) * 100) : 0;
  const failedPercentage = total > 0 ? Math.round((failed / total) * 100) : 0;
  const untestedPercentage = total > 0 ? Math.round((untested / total) * 100) : 0;
  
  // Data for the pie chart
  const data = [
    { name: 'Passed', value: passed, color: '#22c55e' },
    { name: 'Failed', value: failed, color: '#ef4444' },
    { name: 'Untested', value: untested, color: '#eab308' },
  ].filter(item => item.value > 0);

  // Calculate category statistics
  const categories = testItems.reduce((acc, test) => {
    acc[test.category] = acc[test.category] || { total: 0, passed: 0, failed: 0, untested: 0 };
    acc[test.category].total += 1;
    if (test.status === 'passed') acc[test.category].passed += 1;
    if (test.status === 'failed') acc[test.category].failed += 1;
    if (test.status === 'untested') acc[test.category].untested += 1;
    return acc;
  }, {} as Record<string, { total: number; passed: number; failed: number; untested: number }>);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Test Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-medium">{passedPercentage}%</span>
                </div>
                <Progress value={passedPercentage} className="h-2" />
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-green-100 p-2 rounded-md">
                  <div className="text-2xl font-bold text-green-600">{passed}</div>
                  <div className="text-xs text-green-800">Passed</div>
                </div>
                <div className="bg-red-100 p-2 rounded-md">
                  <div className="text-2xl font-bold text-red-600">{failed}</div>
                  <div className="text-xs text-red-800">Failed</div>
                </div>
                <div className="bg-yellow-100 p-2 rounded-md">
                  <div className="text-2xl font-bold text-yellow-600">{untested}</div>
                  <div className="text-xs text-yellow-800">Untested</div>
                </div>
              </div>
            </div>
            
            <div className="h-44">
              {data.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Test Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(categories).map(([category, stats]) => {
              const categoryPassPercentage = stats.total > 0 
                ? Math.round((stats.passed / stats.total) * 100) 
                : 0;
                
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{category}</span>
                    <span>{stats.passed}/{stats.total} ({categoryPassPercentage}%)</span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-500" 
                      style={{ width: `${(stats.passed / stats.total) * 100}%` }} 
                    />
                    <div 
                      className="bg-red-500" 
                      style={{ width: `${(stats.failed / stats.total) * 100}%` }} 
                    />
                    <div 
                      className="bg-yellow-500" 
                      style={{ width: `${(stats.untested / stats.total) * 100}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
