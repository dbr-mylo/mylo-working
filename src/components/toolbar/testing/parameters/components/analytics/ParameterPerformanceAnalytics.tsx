
import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PerformanceData {
  extractionTime: number;
  validationTime?: number;
  memoizedExtractionTime?: number;
  memoizedValidationTime?: number;
  totalTime?: number;
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
  currentExtractionTime = 0,
  currentValidationTime = 0,
  memoizedExtractionTime = 0,
  memoizedValidationTime = 0
}) => {
  // Calculate cache efficiency percentage
  const extractionImprovement = currentExtractionTime > 0 
    ? ((currentExtractionTime - memoizedExtractionTime) / currentExtractionTime) * 100 
    : 0;
    
  const validationImprovement = currentValidationTime > 0 
    ? ((currentValidationTime - memoizedValidationTime) / currentValidationTime) * 100 
    : 0;
  
  // Data for the current performance comparison chart
  const currentData = [
    { name: 'Extraction', regular: currentExtractionTime, memoized: memoizedExtractionTime },
    { name: 'Validation', regular: currentValidationTime, memoized: memoizedValidationTime },
    { name: 'Total', regular: currentExtractionTime + currentValidationTime, memoized: memoizedExtractionTime + memoizedValidationTime }
  ];
  
  // Process historical data for trend charts
  const processedHistory = performanceHistory.map((entry, index) => ({
    name: `Run ${performanceHistory.length - index}`,
    extraction: entry.extractionTime,
    validation: entry.validationTime || 0,
    memoizedExtraction: entry.memoizedExtractionTime || 0,
    memoizedValidation: entry.memoizedValidationTime || 0,
    timestamp: entry.timestamp
  })).reverse();

  return (
    <div className="space-y-4">
      <Tabs defaultValue="current">
        <TabsList className="mb-4">
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="caching">Caching</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle>Current Execution Times (ms)</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Bar chart comparing regular vs memoized execution times */}
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={currentData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => `${value.toFixed(2)} ms`}
                  />
                  <Legend />
                  <Bar name="Regular" dataKey="regular" fill="#3b82f6" />
                  <Bar name="Memoized" dataKey="memoized" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
              
              {/* Summary metrics */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="text-sm text-blue-700 font-medium">Regular Execution</div>
                  <div className="mt-1 grid grid-cols-2 gap-1">
                    <div className="text-xs text-blue-600">Extraction:</div>
                    <div className="text-xs font-mono text-right">{currentExtractionTime.toFixed(2)} ms</div>
                    <div className="text-xs text-blue-600">Validation:</div>
                    <div className="text-xs font-mono text-right">{currentValidationTime.toFixed(2)} ms</div>
                    <div className="text-xs text-blue-600 font-medium">Total:</div>
                    <div className="text-xs font-mono text-right font-medium">{(currentExtractionTime + currentValidationTime).toFixed(2)} ms</div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-md">
                  <div className="text-sm text-green-700 font-medium">Memoized Execution</div>
                  <div className="mt-1 grid grid-cols-2 gap-1">
                    <div className="text-xs text-green-600">Extraction:</div>
                    <div className="text-xs font-mono text-right">{memoizedExtractionTime.toFixed(2)} ms</div>
                    <div className="text-xs text-green-600">Validation:</div>
                    <div className="text-xs font-mono text-right">{memoizedValidationTime.toFixed(2)} ms</div>
                    <div className="text-xs text-green-600 font-medium">Total:</div>
                    <div className="text-xs font-mono text-right font-medium">{(memoizedExtractionTime + memoizedValidationTime).toFixed(2)} ms</div>
                  </div>
                </div>
              </div>
              
              {/* Improvement metrics */}
              <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="text-sm font-medium mb-2">Performance Improvement</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Extraction Efficiency</div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, extractionImprovement)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-right mt-1">{extractionImprovement.toFixed(1)}% faster</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Validation Efficiency</div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, validationImprovement)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-right mt-1">{validationImprovement.toFixed(1)}% faster</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Performance History</CardTitle>
            </CardHeader>
            <CardContent>
              {processedHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={processedHistory}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value: number) => `${value.toFixed(2)} ms`}
                      labelFormatter={(label) => `Test Run: ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      name="Extraction" 
                      dataKey="extraction" 
                      stroke="#3b82f6" 
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      name="Validation" 
                      dataKey="validation" 
                      stroke="#f59e0b" 
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <span className="text-gray-500">Run more tests to see historical data</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="caching">
          <Card>
            <CardHeader>
              <CardTitle>Caching Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              {processedHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={processedHistory}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value: number) => `${value.toFixed(2)} ms`}
                      labelFormatter={(label) => `Test Run: ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      name="Regular Extraction" 
                      dataKey="extraction" 
                      stroke="#3b82f6" 
                    />
                    <Line 
                      type="monotone" 
                      name="Memoized Extraction" 
                      dataKey="memoizedExtraction" 
                      stroke="#10b981" 
                    />
                    <Line 
                      type="monotone" 
                      name="Regular Validation" 
                      dataKey="validation" 
                      stroke="#f59e0b" 
                    />
                    <Line 
                      type="monotone" 
                      name="Memoized Validation" 
                      dataKey="memoizedValidation" 
                      stroke="#14b8a6" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <span className="text-gray-500">Run more tests to see caching efficiency data</span>
                </div>
              )}
              
              <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                <h3 className="text-sm font-medium mb-2">Cache Efficiency Tips</h3>
                <ul className="text-xs space-y-1 text-gray-700 list-disc pl-4">
                  <li>Higher caching efficiency is achieved with consistent parameter patterns</li>
                  <li>Complex validation rules may reduce memoization benefits</li>
                  <li>Clear caches periodically to prevent memory bloat in long-running applications</li>
                  <li>Consider time-to-live (TTL) settings for parameter caches in production</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
