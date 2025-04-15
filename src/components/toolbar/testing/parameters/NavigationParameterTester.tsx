
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { navigationService } from '@/services/navigation/NavigationService';
import { benchmarkFunction } from './utils/parameterTestUtils';

export const NavigationParameterTester: React.FC = () => {
  const { toast } = useToast();
  const [pattern, setPattern] = useState('/content/:contentType/:documentId/version/:versionId');
  const [actualPath, setActualPath] = useState('/content/article/doc-123/version/v2');
  const [results, setResults] = useState<any[]>([]);
  const [benchmarks, setBenchmarks] = useState<{iterations: number; averageTime: number} | null>(null);
  
  // Dynamic fields for complex paths
  const [segments, setSegments] = useState([
    { type: 'static', value: 'content' },
    { type: 'param', name: 'contentType', value: 'article' },
    { type: 'static', value: 'documents' },
    { type: 'param', name: 'documentId', value: 'doc-123' }
  ]);

  const performExtraction = () => {
    try {
      const { result, executionTime } = benchmarkFunction(() => 
        navigationService.extractRouteParameters(pattern, actualPath)
      );
      
      setResults(prev => [{
        timestamp: new Date().toISOString(),
        pattern,
        actualPath,
        result,
        executionTime
      }, ...prev]);
      
      toast({
        title: 'Parameter extraction complete',
        description: `Extracted ${result ? Object.keys(result).length : 0} parameters in ${executionTime.toFixed(2)}ms`,
      });
    } catch (error) {
      toast({
        title: 'Error during extraction',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };
  
  const runBenchmark = () => {
    const iterations = 100;
    let totalTime = 0;
    
    for (let i = 0; i < iterations; i++) {
      const { executionTime } = benchmarkFunction(() => 
        navigationService.extractRouteParameters(pattern, actualPath)
      );
      totalTime += executionTime;
    }
    
    const averageTime = totalTime / iterations;
    
    setBenchmarks({
      iterations,
      averageTime
    });
    
    toast({
      title: 'Benchmark complete',
      description: `${iterations} iterations with average execution time: ${averageTime.toFixed(2)}ms`,
    });
  };
  
  const buildFromSegments = () => {
    let newPattern = '';
    let newActualPath = '';
    
    segments.forEach(segment => {
      if (segment.type === 'static') {
        newPattern += `/${segment.value}`;
        newActualPath += `/${segment.value}`;
      } else {
        newPattern += `/:${segment.name}`;
        newActualPath += `/${segment.value}`;
      }
    });
    
    setPattern(newPattern);
    setActualPath(newActualPath);
  };
  
  const addSegment = (type: 'static' | 'param') => {
    setSegments([...segments, {
      type,
      name: type === 'param' ? 'param' + (segments.length + 1) : '',
      value: type === 'param' ? 'value' + (segments.length + 1) : 'segment' + (segments.length + 1)
    }]);
  };
  
  const updateSegment = (index: number, field: string, value: string) => {
    const newSegments = [...segments];
    (newSegments[index] as any)[field] = value;
    setSegments(newSegments);
  };
  
  const removeSegment = (index: number) => {
    setSegments(segments.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Navigation Parameter Tester</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Testing</TabsTrigger>
            <TabsTrigger value="builder">Path Builder</TabsTrigger>
            <TabsTrigger value="benchmark">Performance</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Route Pattern</label>
              <Input 
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="/user/:id"
                className="font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Actual Path</label>
              <Input 
                value={actualPath}
                onChange={(e) => setActualPath(e.target.value)}
                placeholder="/user/123"
                className="font-mono"
              />
            </div>
            
            <Button onClick={performExtraction}>Extract Parameters</Button>
          </TabsContent>
          
          <TabsContent value="builder" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Path Segment Builder</h3>
              <p className="text-xs text-muted-foreground">
                Build complex paths by adding static segments and parameter placeholders
              </p>
              
              {segments.map((segment, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <select 
                    className="p-2 border rounded-md"
                    value={segment.type}
                    onChange={(e) => updateSegment(index, 'type', e.target.value as 'static' | 'param')}
                  >
                    <option value="static">Static</option>
                    <option value="param">Parameter</option>
                  </select>
                  
                  {segment.type === 'param' && (
                    <Input
                      placeholder="Parameter name"
                      value={segment.name}
                      onChange={(e) => updateSegment(index, 'name', e.target.value)}
                      className="w-1/3"
                    />
                  )}
                  
                  <Input
                    placeholder={segment.type === 'static' ? 'Segment value' : 'Parameter value'}
                    value={segment.value}
                    onChange={(e) => updateSegment(index, 'value', e.target.value)}
                  />
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeSegment(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => addSegment('static')}>
                  Add Static Segment
                </Button>
                <Button variant="outline" onClick={() => addSegment('param')}>
                  Add Parameter
                </Button>
                <Button onClick={buildFromSegments}>
                  Build Path
                </Button>
              </div>
            </div>
            
            <div className="border rounded-md p-4 bg-muted/50 space-y-2">
              <div>
                <span className="text-sm font-medium">Route Pattern:</span>
                <code className="ml-2 text-sm bg-background p-1 rounded">{pattern}</code>
              </div>
              <div>
                <span className="text-sm font-medium">Actual Path:</span>
                <code className="ml-2 text-sm bg-background p-1 rounded">{actualPath}</code>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="benchmark" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Performance Benchmarking</h3>
              <p className="text-xs text-muted-foreground">
                Run multiple iterations to measure average performance
              </p>
            </div>
            
            <Button onClick={runBenchmark}>Run Benchmark (100 iterations)</Button>
            
            {benchmarks && (
              <div className="border rounded-md p-4 bg-muted/50">
                <h3 className="font-medium mb-2">Benchmark Results</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Iterations:</strong> {benchmarks.iterations}</p>
                  <p><strong>Average Time:</strong> {benchmarks.averageTime.toFixed(4)}ms</p>
                  <p><strong>Pattern:</strong> <code className="bg-background p-1 rounded">{pattern}</code></p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            <div className="border rounded-md overflow-auto max-h-96">
              {results.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  No test results yet. Run parameter extraction to see results.
                </div>
              ) : (
                <div className="space-y-4 p-4">
                  {results.map((result, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium flex items-center gap-2">
                          Test #{results.length - index}
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {result.executionTime.toFixed(2)}ms
                          </Badge>
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="grid gap-1 text-sm">
                        <div className="mb-1">
                          <span className="font-medium">Pattern:</span>
                          <code className="ml-2 bg-background p-1 rounded">{result.pattern}</code>
                        </div>
                        <div className="mb-1">
                          <span className="font-medium">Path:</span>
                          <code className="ml-2 bg-background p-1 rounded">{result.actualPath}</code>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <span className="font-medium text-sm">Result:</span>
                        <pre className="bg-background p-2 rounded-md text-xs overflow-auto mt-1">
                          {JSON.stringify(result.result, null, 2) || "null"}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
