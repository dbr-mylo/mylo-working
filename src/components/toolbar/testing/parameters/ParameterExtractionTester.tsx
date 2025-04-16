
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PARAMETER_TEST_CASES, extractParameters, validateParameters } from './utils/parameterTestUtils';
import { PathSegmentBuilder, PathSegment } from './components/PathSegmentBuilder';

export const ParameterExtractionTester: React.FC = () => {
  const { toast } = useToast();
  const [pattern, setPattern] = useState('/user/:id');
  const [actualPath, setActualPath] = useState('/user/123');
  const [extractedParams, setExtractedParams] = useState<Record<string, string> | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [segments, setSegments] = useState<PathSegment[]>([
    { type: 'static', name: '', value: 'user' },
    { type: 'param', name: 'id', value: '123' }
  ]);

  useEffect(() => {
    // Extract parameters when paths change
    try {
      const params = extractParameters(pattern, actualPath);
      setExtractedParams(params);
    } catch (error) {
      console.error('Error extracting parameters:', error);
      setExtractedParams(null);
    }
  }, [pattern, actualPath]);

  const handleTestCaseSelect = (testCase: keyof typeof PARAMETER_TEST_CASES) => {
    const selectedCase = PARAMETER_TEST_CASES[testCase];
    setPattern(selectedCase.pattern);
    setActualPath(selectedCase.actual);
    
    // Update segments based on the test case
    const newSegments: PathSegment[] = [];
    const patternSegments = selectedCase.pattern.split('/').filter(Boolean);
    
    patternSegments.forEach(segment => {
      if (segment.startsWith(':')) {
        const paramName = segment.substring(1);
        const paramValue = selectedCase.expected?.[paramName] || '';
        newSegments.push({ type: 'param', name: paramName, value: paramValue });
      } else {
        newSegments.push({ type: 'static', name: '', value: segment });
      }
    });
    
    setSegments(newSegments);
  };

  const validateExtractedParams = () => {
    if (!extractedParams) {
      toast({
        title: 'No parameters extracted',
        description: 'Cannot validate parameters. Make sure your pattern and path match',
        variant: 'destructive',
      });
      setIsValid(false);
      return;
    }

    try {
      // For validation, we'll create an expected object from the segments
      const expectedParams: Record<string, string> = {};
      segments
        .filter(s => s.type === 'param')
        .forEach(s => {
          expectedParams[s.name] = s.value;
        });

      const validationResult = validateParameters(extractedParams, expectedParams);
      setIsValid(validationResult.valid);

      if (validationResult.valid) {
        toast({
          title: 'Parameters are valid',
          description: 'Extracted parameters match expected values',
        });
      } else {
        toast({
          title: 'Parameter validation failed',
          description: `${validationResult.mismatches.length} mismatches found`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error validating parameters:', error);
      toast({
        title: 'Error during validation',
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

  const buildPathFromSegments = () => {
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
        <CardTitle>Parameter Extraction Tester</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sample Test Cases</label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(PARAMETER_TEST_CASES).map(key => (
                <Button
                  key={key}
                  size="sm"
                  variant="outline"
                  onClick={() => handleTestCaseSelect(key as keyof typeof PARAMETER_TEST_CASES)}
                >
                  {key}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
          
          <div className="border-t pt-6">
            <PathSegmentBuilder
              segments={segments}
              onSegmentUpdate={handleSegmentUpdate}
              onSegmentRemove={(index) => {
                setSegments(segments.filter((_, i) => i !== index));
              }}
              onAddSegment={(type) => {
                setSegments([...segments, { type, name: '', value: '' }]);
              }}
              onBuildPath={buildPathFromSegments}
            />
          </div>
          
          <Button onClick={validateExtractedParams} className="w-full">
            Validate Parameters
          </Button>
          
          <div className="border rounded-md p-4 bg-muted/30">
            <h3 className="text-sm font-medium mb-2">Extracted Parameters</h3>
            {extractedParams === null ? (
              <p className="text-sm text-muted-foreground">No parameters extracted. Pattern and path may not match.</p>
            ) : Object.keys(extractedParams).length === 0 ? (
              <p className="text-sm text-muted-foreground">No parameters found in the path.</p>
            ) : (
              <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto">
                {JSON.stringify(extractedParams, null, 2)}
              </pre>
            )}
            
            {isValid !== null && (
              <div className={`mt-2 p-2 rounded-md ${isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isValid ? 'Parameters are valid!' : 'Parameters do not match expected values.'}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
