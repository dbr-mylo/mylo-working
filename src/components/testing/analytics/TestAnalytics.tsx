
import React, { useState, useEffect } from "react";
import { BarChart } from "lucide-react";
import { getRoutePerformanceMetrics } from "@/utils/navigation/routeValidation";
import { getErrorBoundaryAnalytics } from "@/components/errors/ErrorBoundary";

interface RouteMetric {
  averageLoadTime: number;
  errorRate: number;
  trafficVolume: number;
}

/**
 * Analytics dashboard component showing test metrics
 */
export const TestAnalytics: React.FC = () => {
  const [metrics, setMetrics] = useState<Record<string, RouteMetric>>({});
  const [errorData, setErrorData] = useState<any[]>([]);
  
  // Fetch metrics data
  useEffect(() => {
    // Get route metrics for a test path
    const routeMetrics = getRoutePerformanceMetrics("/test");
    
    // Convert the metrics to the expected format
    const formattedMetrics: Record<string, RouteMetric> = {
      "/test": {
        averageLoadTime: routeMetrics.avgLoadTime,
        errorRate: routeMetrics.errorRate,
        trafficVolume: routeMetrics.visitCount
      }
    };
    
    setMetrics(formattedMetrics);
    
    const errorMetrics = getErrorBoundaryAnalytics();
    setErrorData(errorMetrics);
  }, []);
  
  if (Object.keys(metrics).length === 0 && errorData.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-500">No analytics data available yet.</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 border rounded-md mb-4">
      <div className="flex items-center mb-4">
        <BarChart className="mr-2 h-5 w-5 text-blue-600" />
        <h3 className="font-medium">Test Analytics</h3>
      </div>
      
      {Object.keys(metrics).length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Route Performance</h4>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(metrics).map(([route, data]) => (
              <div key={route} className="p-2 border rounded-md">
                <div className="text-xs font-medium">{route}</div>
                <div className="text-xs">Load time: {data.averageLoadTime}ms</div>
                <div className="text-xs">Error rate: {(data.errorRate * 100).toFixed(1)}%</div>
                <div className="text-xs">Traffic: {data.trafficVolume} visits</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {errorData.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Recent Errors ({errorData.length})</h4>
          <div className="max-h-40 overflow-y-auto">
            {errorData.map((error, i) => (
              <div key={i} className="p-2 mb-1 border rounded-md text-xs">
                <div><b>{error.componentName}</b>: {error.errorMessage}</div>
                <div>Recovered: {error.wasRecovered ? 'Yes' : 'No'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
