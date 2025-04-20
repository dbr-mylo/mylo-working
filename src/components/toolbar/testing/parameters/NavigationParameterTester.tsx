
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { benchmarkOperation } from '@/utils/navigation/parameters/performanceMonitor'; 
import { PathSegmentBuilder, PathSegment } from './components/PathSegmentBuilder';
import { navigationService } from '@/services/navigation/NavigationService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NavigationParameterTesterProps {
  onTestResult?: (result: any) => void;
}

export const NavigationParameterTester: React.FC<NavigationParameterTesterProps> = ({
  onTestResult
}) => {
  const { toast } = useToast();
  const [pattern, setPattern] = useState('/content/:contentType/:documentId/version/:versionId');
  const [actualPath, setActualPath] = useState('/content/article/doc-123/version/v2');
  const [results, setResults] = useState<any[]>([]);
  const [benchmarks, setBenchmarks] = useState<{iterations: number; averageTime: number} | null>(null);
  const [segments, setSegments] = useState<PathSegment[]>([
    { type: 'static', name: '', value: 'content' },
    { type: 'param', name: 'contentType', value: 'article' },
    { type: 'static', name: '', value: 'document' },
    { type: 'param', name: 'documentId', value: 'doc-123' },
    { type: 'static', name: '', value: 'version' },
    { type: 'param', name: 'versionId', value: 'v2' }
  ]);
  const [iterations, setIterations] = useState(1);

  const performExtraction = () => {
    try {
      const { result, performance } = benchmarkOperation(
        'extractParameters',
        () => navigationService.extractRouteParameters(pattern, actualPath)
      );
      
      const newResult = {
        timestamp: new Date().toISOString(),
        pattern,
        actualPath,
        params: result,
        errors: [],
        hierarchy: {},
        isValid: true,
        performance: {
          extractionTime: performance.executionTime,
          operationsPerSecond: performance.operationsPerSecond
        }
      };
      
      // Also test memoized version to compare
      // We need to modify how we call this function - removing the third argument
      const { performance: memoizedPerformance } = benchmarkOperation(
        'memoizedExtractParameters',
        () => navigationService.extractRouteParameters(pattern, actualPath)
      );
      
      // Add memoized performance data to the newResult
      // We need to modify the type to match what's expected
      newResult.performance = {
        ...newResult.performance,
        // These properties will be added to the object even though they're not in the type
        memoizedExtractionTime: memoizedPerformance.executionTime,
        memoizedOperationsPerSecond: memoizedPerformance.operationsPerSecond
      };
      
      setResults(prev => [newResult, ...prev]);
      
      if (onTestResult) {
        onTestResult(newResult);
      }
      
      toast({
        title: 'Parameter extraction complete',
        description: `Extracted ${result ? Object.keys(result).length : 0} parameters in ${performance.executionTime.toFixed(2)}ms`,
      });
    } catch (error) {
      const errorResult = {
        timestamp: new Date().toISOString(),
        pattern,
        actualPath,
        params: {},
        errors: [error instanceof Error ? error.message : String(error)],
        hierarchy: {},
        isValid: false,
        performance: { extractionTime: 0 }
      };
      
      setResults(prev => [errorResult, ...prev]);
      
      if (onTestResult) {
        onTestResult(errorResult);
      }
      
      toast({
        title: 'Error during extraction',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleSegmentUpdate = (index: number, field: string, value: string) => {
    const newSegments = [...segments];
    if (field === 'type' && (value === 'static' || value === 'param')) {
      newSegments[index].type = value;
    } else if (field === 'name' || field === 'value') {
      (newSegments[index] as any)[field] = value;
    }
    setSegments(newSegments);
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Navigation Parameter Tester</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Path Builder</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <PathSegmentBuilder
              segments={segments}
              onSegmentUpdate={handleSegmentUpdate}
              onSegmentRemove={(index) => {
                setSegments(segments.filter((_, i) => i !== index));
              }}
              onAddSegment={(type) => {
                setSegments([...segments, { type, name: '', value: '' }]);
              }}
              onBuildPath={buildFromSegments}
            />
            
            <Button className="w-full" onClick={performExtraction}>Test Parameters</Button>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pattern</label>
              <Input 
                value={pattern}
                onChange={e => setPattern(e.target.value)}
                placeholder="/path/:param1/:param2?/:param3"
              />
              <p className="text-xs text-muted-foreground">
                Use : for parameters, add ? for optional parameters.
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Path</label>
              <Input
                value={actualPath}
                onChange={e => setActualPath(e.target.value)}
                placeholder="/path/value1/value2/value3"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Performance Test Iterations</label>
              <Input
                type="number"
                value={iterations}
                onChange={e => setIterations(parseInt(e.target.value) || 1)}
                min={1}
                max={1000}
              />
              <p className="text-xs text-muted-foreground">
                Higher values give more accurate performance metrics but take longer.
              </p>
            </div>
            
            <Button className="w-full" onClick={performExtraction}>
              Run Parameter Test
            </Button>
          </TabsContent>
          
          <TabsContent value="results">
            <div className="border rounded-md overflow-auto max-h-96">
              {results.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No test results yet. Run a test to see results.
                </div>
              ) : (
                results.map((result, index) => (
                  <div key={index} className="border-b p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {result.performance?.extractionTime?.toFixed(2) || 'N/A'}ms
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p><strong>Pattern:</strong> {result.pattern}</p>
                      <p><strong>Path:</strong> {result.actualPath}</p>
                      <pre className="bg-muted p-2 rounded-md text-xs overflow-auto">
                        {JSON.stringify(result.params, null, 2)}
                      </pre>
                      
                      {result.errors?.length > 0 && (
                        <div className="mt-2 text-red-500 text-sm">
                          <p><strong>Errors:</strong></p>
                          <ul className="list-disc list-inside">
                            {result.errors.map((err: string, i: number) => (
                              <li key={i}>{err}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {result.performance?.memoizedExtractionTime && (
                        <div className="text-sm text-muted-foreground">
                          <p>Memoized: {result.performance.memoizedExtractionTime.toFixed(2)}ms</p>
                          <p>Improvement: {
                            result.performance.extractionTime > 0 
                              ? ((result.performance.extractionTime - result.performance.memoizedExtractionTime) / 
                                  result.performance.extractionTime * 100).toFixed(1) 
                              : '0'
                          }%</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NavigationParameterTester;
