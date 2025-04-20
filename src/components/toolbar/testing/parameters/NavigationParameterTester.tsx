
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PathSegmentBuilder } from './components/PathSegmentBuilder';
import { TestResultsList } from './components/TestResultsList';
import { useNavigationTesting } from './hooks/useNavigationTesting';
import { PathSegment, NavigationParameterTesterProps } from './types';

export const NavigationParameterTester: React.FC<NavigationParameterTesterProps> = ({
  onTestResult
}) => {
  const {
    pattern,
    setPattern,
    actualPath,
    setActualPath,
    results,
    performExtraction
  } = useNavigationTesting(onTestResult);

  const [segments, setSegments] = useState<PathSegment[]>([
    { type: 'static', name: '', value: 'content' },
    { type: 'param', name: 'contentType', value: 'article' },
    { type: 'static', name: '', value: 'document' },
    { type: 'param', name: 'documentId', value: 'doc-123' },
    { type: 'static', name: '', value: 'version' },
    { type: 'param', name: 'versionId', value: 'v2' }
  ]);
  const [iterations, setIterations] = useState(1);

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
            
            <Button className="w-full" onClick={performExtraction}>
              Test Parameters
            </Button>
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
            <TestResultsList results={results} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NavigationParameterTester;
