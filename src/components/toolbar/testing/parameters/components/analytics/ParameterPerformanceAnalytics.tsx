
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar 
} from 'recharts';
import { DonutChart } from '@/components/ui/donut-chart';

interface PerformanceData {
  extractionTime: number;
  validationTime?: number;
  memoizedExtractionTime?: number;
  memoizedValidationTime?: number;
  timestamp: number;
}

interface ParameterPerformanceAnalyticsProps {
  performanceHistory: PerformanceData[];
  currentExtractionTime: number;
  currentValidationTime?: number;
  memoizedExtractionTime?: number;
  memoizedValidationTime?: number;
}

export const ParameterPerformanceAnalytics: React.FC<ParameterPerformanceAnalyticsProps> = ({
  performanceHistory,
  currentExtractionTime,
  currentValidationTime = 0,
  memoizedExtractionTime = 0,
  memoizedValidationTime = 0
}) => {
  // Format timestamp for display on chart
  const formattedHistory = performanceHistory.map(item => ({
    ...item,
    timeLabel: new Date(item.timestamp).toLocaleTimeString()
  })).reverse();
  
  // Calculate performance improvement percentage for extraction
  const extractionImprovement = currentExtractionTime && memoizedExtractionTime 
    ? ((currentExtractionTime - memoizedExtractionTime) / currentExtractionTime * 100).toFixed(1)
    : '0';
  
  // Calculate performance improvement percentage for validation
  const validationImprovement = currentValidationTime && memoizedValidationTime
    ? ((currentValidationTime - memoizedValidationTime) / currentValidationTime * 100).toFixed(1)
    : '0';
    
  // Prepare data for comparison chart
  const comparisonData = [
    {
      name: 'Extraction',
      regular: currentExtractionTime,
      memoized: memoizedExtractionTime || 0
    },
    {
      name: 'Validation',
      regular: currentValidationTime || 0,
      memoized: memoizedValidationTime || 0
    }
  ];
  
  // Prepare data for operation breakdown
  const operationBreakdown = [
    {
      name: 'Extraction',
      value: currentExtractionTime,
      color: '#3182ce' // blue
    },
    {
      name: 'Validation',
      value: currentValidationTime || 0,
      color: '#38a169' // green
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Performance metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Extraction Time</div>
              <div className="text-2xl font-bold">{currentExtractionTime.toFixed(2)}ms</div>
              {memoizedExtractionTime ? (
                <div className="text-xs text-green-600 mt-1">
                  {extractionImprovement}% faster with memoization
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Validation Time</div>
              <div className="text-2xl font-bold">{currentValidationTime ? `${currentValidationTime.toFixed(2)}ms` : 'N/A'}</div>
              {currentValidationTime && memoizedValidationTime ? (
                <div className="text-xs text-green-600 mt-1">
                  {validationImprovement}% faster with memoization
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Total Time</div>
              <div className="text-2xl font-bold">
                {((currentExtractionTime || 0) + (currentValidationTime || 0)).toFixed(2)}ms
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {performanceHistory.length} runs recorded
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Performance history chart */}
      {performanceHistory.length > 1 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium mb-3">Performance History</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timeLabel" 
                    tick={{ fontSize: 10 }} 
                    label={{ value: 'Time', position: 'insideBottomRight', offset: 0 }}
                  />
                  <YAxis 
                    label={{ value: 'ms', angle: -90, position: 'insideLeft' }}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="extractionTime" 
                    name="Extraction" 
                    stroke="#3182ce" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="validationTime" 
                    name="Validation" 
                    stroke="#38a169"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="memoizedExtractionTime" 
                    name="Memoized Extraction" 
                    stroke="#90cdf4" 
                    strokeDasharray="3 3"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="memoizedValidationTime" 
                    name="Memoized Validation" 
                    stroke="#9ae6b4"
                    strokeDasharray="3 3"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Performance comparison and breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Regular vs Memoized comparison */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium mb-3">Memoization Performance Gain</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="regular" name="Regular" fill="#3182ce" />
                  <Bar dataKey="memoized" name="Memoized" fill="#90cdf4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Operation breakdown donut chart */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium mb-3">Operation Time Breakdown</h3>
            <div className="h-64">
              <DonutChart data={operationBreakdown} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
