
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export interface MemoryPoint {
  timestamp: string;
  heapUsed: number;
  heapTotal: number;
  label?: string;
}

interface MemoryUsageReporterProps {
  memoryData: MemoryPoint[];
  showWarnings?: boolean;
  warningThreshold?: number; // MB
}

export const MemoryUsageReporter: React.FC<MemoryUsageReporterProps> = ({ 
  memoryData, 
  showWarnings = true,
  warningThreshold = 50 // 50MB default threshold
}) => {
  const formattedData = memoryData.map(point => ({
    ...point,
    heapUsedMB: Math.round(point.heapUsed / 1024 / 1024 * 100) / 100,
    heapTotalMB: Math.round(point.heapTotal / 1024 / 1024 * 100) / 100,
    time: new Date(point.timestamp).toLocaleTimeString()
  }));

  // Calculate memory growth between first and last points
  const memoryGrowth = memoryData.length > 1 
    ? memoryData[memoryData.length - 1].heapUsed - memoryData[0].heapUsed 
    : 0;
  const growthMB = Math.round(memoryGrowth / 1024 / 1024 * 100) / 100;
  const hasLeak = showWarnings && growthMB > warningThreshold;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Memory Usage Analysis</span>
          {memoryData.length > 0 && (
            <span className="text-sm font-normal">
              Current: {formattedData[formattedData.length - 1]?.heapUsedMB || 0}MB / 
              {formattedData[formattedData.length - 1]?.heapTotalMB || 0}MB
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {memoryData.length > 1 ? (
          <>
            <div className="mb-4 h-[250px]">
              <LineChart
                width={600}
                height={250}
                data={formattedData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} MB`, 'Memory']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="heapUsedMB" 
                  stroke="#8884d8" 
                  name="Heap Used (MB)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="heapTotalMB" 
                  stroke="#82ca9d" 
                  name="Heap Total (MB)"
                  strokeDasharray="3 3"
                />
              </LineChart>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 border rounded-lg">
                <div className="text-sm font-medium">Memory Growth</div>
                <div className={`text-2xl ${growthMB > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {growthMB > 0 ? '+' : ''}{growthMB} MB
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-sm font-medium">Test Duration</div>
                <div className="text-2xl">
                  {memoryData.length} points
                </div>
              </div>
            </div>
            
            {hasLeak && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Potential memory leak detected! Memory growth of {growthMB}MB exceeds threshold of {warningThreshold}MB.
                </AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            Run tests to collect memory usage data
          </div>
        )}
      </CardContent>
    </Card>
  );
};
