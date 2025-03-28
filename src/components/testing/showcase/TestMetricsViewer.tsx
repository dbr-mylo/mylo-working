
import React from 'react';
import { DonutChart } from '@/components/ui/donut-chart';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TestResult {
  component: string;
  passed: boolean;
  timestamp: string;
  error?: string;
  duration?: number;
}

interface TestMetricsViewerProps {
  results: TestResult[];
}

export const TestMetricsViewer: React.FC<TestMetricsViewerProps> = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No test results available
      </div>
    );
  }
  
  const passedTests = results.filter(r => r.passed).length;
  const failedTests = results.filter(r => !r.passed).length;
  
  // Prepare data for the donut chart
  const chartData = [
    {
      name: 'Passed',
      value: passedTests,
      color: '#10b981', // green
    },
    {
      name: 'Failed',
      value: failedTests,
      color: '#ef4444', // red
    },
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Test Results</h3>
          <p className="text-xs text-muted-foreground">
            {results.length} tests run
          </p>
        </div>
        <Badge variant={failedTests === 0 ? "outline" : "secondary"} 
          className={failedTests === 0 ? "border-green-500 text-green-500" : ""}>
          {passedTests}/{results.length} Passed
        </Badge>
      </div>
      
      <div className="h-48">
        <DonutChart data={chartData} />
      </div>
      
      <div className="space-y-2 mt-4">
        <h4 className="text-xs font-medium">Recent Results</h4>
        {results.slice(0, 5).map((result, index) => (
          <div key={index} className="flex items-start text-xs">
            {result.passed ? (
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <div className="font-medium">{result.component}</div>
              {result.error && <div className="text-red-500">{result.error}</div>}
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(result.timestamp).toLocaleTimeString()}
                {result.duration && ` (${result.duration}ms)`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
