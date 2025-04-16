
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { benchmarkFunction } from './utils/parameterTestUtils';
import { PathSegmentBuilder, PathSegment } from './components/PathSegmentBuilder';
import { navigationService } from '@/services/navigation/NavigationService';

export const NavigationParameterTester: React.FC = () => {
  const { toast } = useToast();
  const [pattern, setPattern] = useState('/content/:contentType/:documentId/version/:versionId');
  const [actualPath, setActualPath] = useState('/content/article/doc-123/version/v2');
  const [results, setResults] = useState<any[]>([]);
  const [benchmarks, setBenchmarks] = useState<{iterations: number; averageTime: number} | null>(null);
  const [segments, setSegments] = useState<PathSegment[]>([
    { type: 'static', name: '', value: 'content' },
    { type: 'param', name: 'contentType', value: 'article' }
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
            <TabsTrigger value="basic">Basic Testing</TabsTrigger>
            <TabsTrigger value="builder">Path Builder</TabsTrigger>
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
          </TabsContent>
          
          <TabsContent value="results">
            <div className="border rounded-md overflow-auto max-h-96">
              {results.map((result, index) => (
                <div key={index} className="border-b p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {result.executionTime.toFixed(2)}ms
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Pattern:</strong> {result.pattern}</p>
                    <p><strong>Path:</strong> {result.actualPath}</p>
                    <pre className="bg-muted p-2 rounded-md text-xs overflow-auto">
                      {JSON.stringify(result.result, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
