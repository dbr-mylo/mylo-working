
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  PerformanceResult, 
  getRecentPerformanceHistory, 
  comparePerformance,
  createCombinedMetrics,
  benchmarkFunction
} from '@/utils/navigation/parameters/performanceMonitor';
import { getParameterCacheMetrics } from '@/utils/navigation/parameters/memoizedParameterHandler';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const PerformanceMetricsVisualization: React.FC = () => {
  const [metrics, setMetrics] = useState<{
    history: PerformanceResult[];
    cacheMetrics: ReturnType<typeof getParameterCacheMetrics>;
    combinedMetrics: ReturnType<typeof createCombinedMetrics>;
  } | null>(null);

  const [activeTab, setActiveTab] = useState('overview');
  const [compareOperations, setCompareOperations] = useState<{
    op1: string;
    op2: string;
    results?: ReturnType<typeof comparePerformance>;
  }>({ op1: 'extractParameters', op2: 'memoizedExtractParameters' });

  useEffect(() => {
    // Initial load of metrics
    refreshMetrics();
    
    // Set up periodic refresh
    const intervalId = setInterval(refreshMetrics, 5000);
    return () => clearInterval(intervalId);
  }, []);
  
  const refreshMetrics = () => {
    const history = getRecentPerformanceHistory(100);
    const cacheMetrics = getParameterCacheMetrics();
    const combinedMetrics = createCombinedMetrics(
      cacheMetrics.extraction, 
      history.filter(h => h.operationName === 'memoizedExtractParameters')
    );
    
    setMetrics({
      history,
      cacheMetrics,
      combinedMetrics
    });
  };
  
  const runComparison = () => {
    if (!compareOperations.op1 || !compareOperations.op2) return;
    
    const results = comparePerformance(
      compareOperations.op1,
      compareOperations.op2
    );
    
    setCompareOperations({
      ...compareOperations,
      results
    });
  };
  
  const formatData = (history: PerformanceResult[]) => {
    // Group by operationName and prepare for chart
    const operations = [...new Set(history.map(item => item.operationName))];
    
    return history.map((item, index) => ({
      name: index,
      timestamp: new Date(item.timestamp).toLocaleTimeString(),
      operationName: item.operationName,
      executionTime: item.executionTime,
      operationsPerSecond: item.operationsPerSecond,
      ...operations.reduce((acc, op) => {
        // Add execution time for each operation
        acc[op] = item.operationName === op ? item.executionTime : null;
        return acc;
      }, {} as Record<string, number | null>)
    }));
  };

  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Loading metrics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = formatData(metrics.history);
  const operations = [...new Set(metrics.history.map(item => item.operationName))];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Parameter Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="charts">Performance Charts</TabsTrigger>
            <TabsTrigger value="cache">Cache Metrics</TabsTrigger>
            <TabsTrigger value="compare">Compare Operations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium mb-1">Cache Efficiency</h3>
                <div className="text-2xl font-bold">
                  {metrics.combinedMetrics.cacheEfficiency.toFixed(1)}%
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium mb-1">Avg Execution Time</h3>
                <div className="text-2xl font-bold">
                  {metrics.combinedMetrics.averageExecutionTime.toFixed(2)}ms
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium mb-1">Cache Entries</h3>
                <div className="text-2xl font-bold">
                  {metrics.cacheMetrics.extraction.size + metrics.cacheMetrics.validation.size}
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium mb-1">Time Saved</h3>
                <div className="text-2xl font-bold">
                  {(metrics.combinedMetrics.estimatedTimeSaved / 1000).toFixed(2)}s
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">Recent Operations</h3>
              <div className="space-y-2">
                {metrics.history.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <Badge variant="outline" className="mr-2">
                        {item.operationName}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm">
                      {item.executionTime.toFixed(2)}ms
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="charts">
            <div className="space-y-6">
              <div className="h-64">
                <h3 className="text-sm font-medium mb-2">Execution Time (ms)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {operations.map((op) => (
                      <Line 
                        key={op} 
                        type="monotone" 
                        dataKey={op} 
                        name={op} 
                        strokeWidth={2}
                        stroke={op.includes('memoized') ? '#10b981' : '#3b82f6'} 
                        dot={false}
                        connectNulls
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-64">
                <h3 className="text-sm font-medium mb-2">Operations Per Second</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.history.map((item, index) => ({
                    name: index,
                    timestamp: new Date(item.timestamp).toLocaleTimeString(),
                    operation: item.operationName,
                    ops: item.operationsPerSecond
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="ops" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cache">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">Extraction Cache</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Cache hits:</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {metrics.cacheMetrics.extraction.hits}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Cache misses:</span>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      {metrics.cacheMetrics.extraction.misses}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Cache size:</span>
                    <Badge variant="outline">
                      {metrics.cacheMetrics.extraction.size} entries
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Created at:</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(metrics.cacheMetrics.extraction.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hit ratio:</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {metrics.cacheMetrics.extraction.hits + metrics.cacheMetrics.extraction.misses > 0 
                        ? ((metrics.cacheMetrics.extraction.hits / 
                          (metrics.cacheMetrics.extraction.hits + metrics.cacheMetrics.extraction.misses)) * 100).toFixed(1) 
                        : 0}%
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">Validation Cache</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Cache hits:</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {metrics.cacheMetrics.validation.hits}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Cache misses:</span>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      {metrics.cacheMetrics.validation.misses}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Cache size:</span>
                    <Badge variant="outline">
                      {metrics.cacheMetrics.validation.size} entries
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Created at:</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(metrics.cacheMetrics.validation.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hit ratio:</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {metrics.cacheMetrics.validation.hits + metrics.cacheMetrics.validation.misses > 0 
                        ? ((metrics.cacheMetrics.validation.hits / 
                          (metrics.cacheMetrics.validation.hits + metrics.cacheMetrics.validation.misses)) * 100).toFixed(1) 
                        : 0}%
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="compare">
            <div className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Operation 1</label>
                  <select 
                    className="w-full border rounded p-2"
                    value={compareOperations.op1}
                    onChange={(e) => setCompareOperations({
                      ...compareOperations,
                      op1: e.target.value
                    })}
                  >
                    {operations.map(op => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Operation 2</label>
                  <select
                    className="w-full border rounded p-2"
                    value={compareOperations.op2}
                    onChange={(e) => setCompareOperations({
                      ...compareOperations,
                      op2: e.target.value
                    })}
                  >
                    {operations.map(op => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>
                </div>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={runComparison}
                >
                  Compare
                </button>
              </div>
              
              {compareOperations.results && (
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-2">Comparison Results</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Operation 1 average time:</span>
                      <Badge variant="outline">
                        {compareOperations.results.operation1.averageExecutionTime.toFixed(2)}ms
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Operation 2 average time:</span>
                      <Badge variant="outline">
                        {compareOperations.results.operation2.averageExecutionTime.toFixed(2)}ms
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Time difference:</span>
                      <Badge 
                        variant="outline" 
                        className={compareOperations.results.improvement.time > 0 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-red-50 text-red-700'}
                      >
                        {Math.abs(compareOperations.results.improvement.time).toFixed(2)}ms 
                        ({compareOperations.results.improvement.time > 0 ? 'slower' : 'faster'})
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Percentage improvement:</span>
                      <Badge 
                        variant="outline"
                        className={compareOperations.results.improvement.percentage > 0 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-red-50 text-red-700'}
                      >
                        {Math.abs(compareOperations.results.improvement.percentage).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
