
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Copy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PARAMETER_TEST_CASES, extractParameters, validateParameters, benchmarkFunction } from './utils/parameterTestUtils';

export const ParameterExtractionTester: React.FC = () => {
  const { toast } = useToast();
  const [pattern, setPattern] = useState('/user/:id');
  const [actualPath, setActualPath] = useState('/user/123');
  const [expectedParams, setExpectedParams] = useState('{"id": "123"}');
  const [extractedParams, setExtractedParams] = useState<Record<string, string> | null>(null);
  const [validation, setValidation] = useState<{ valid: boolean; mismatches: string[] }>({ valid: true, mismatches: [] });
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const runExtraction = () => {
    try {
      // Run extraction with performance benchmark
      const { result, executionTime } = benchmarkFunction(() => extractParameters(pattern, actualPath));
      setExtractedParams(result);
      setExecutionTime(executionTime);
      
      // Validate against expected parameters
      try {
        const expected = JSON.parse(expectedParams);
        const validation = validateParameters(result, expected);
        setValidation(validation);
      } catch (error) {
        toast({
          title: 'Invalid expected parameters',
          description: 'Expected parameters must be a valid JSON object',
          variant: 'destructive',
        });
      }
      
      toast({
        title: 'Parameter extraction complete',
        description: `Execution time: ${executionTime.toFixed(2)}ms`,
      });
    } catch (error) {
      toast({
        title: 'Error during extraction',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'Parameter data copied to clipboard',
    });
  };
  
  const loadTestCase = (testCaseKey: string) => {
    const testCase = PARAMETER_TEST_CASES[testCaseKey as keyof typeof PARAMETER_TEST_CASES];
    if (testCase) {
      setPattern(testCase.pattern);
      setActualPath(testCase.actual);
      setExpectedParams(JSON.stringify(testCase.expected, null, 2));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Parameter Extraction Tester</span>
          <div className="flex gap-2">
            {validation.valid ? 
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Valid</Badge> : 
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Invalid</Badge>
            }
            {executionTime !== null && 
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{executionTime.toFixed(2)}ms</Badge>
            }
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual">
          <TabsList className="mb-4">
            <TabsTrigger value="manual">Manual Input</TabsTrigger>
            <TabsTrigger value="presets">Test Cases</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Route Pattern</label>
              <Input 
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="/user/:id"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                The route pattern with parameter placeholders (e.g., /user/:id/profile/:section)
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Actual Path</label>
              <Input 
                value={actualPath}
                onChange={(e) => setActualPath(e.target.value)}
                placeholder="/user/123"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                The actual URL path with parameter values (e.g., /user/123/profile/settings)
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Expected Parameters (JSON)</label>
              <Input 
                value={expectedParams}
                onChange={(e) => setExpectedParams(e.target.value)}
                placeholder='{"id": "123"}'
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                JSON object with expected parameter names and values
              </p>
            </div>
            
            <Button onClick={runExtraction}>
              Extract Parameters
            </Button>
          </TabsContent>
          
          <TabsContent value="presets" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(PARAMETER_TEST_CASES).map(([key, testCase]) => (
                <Card key={key} className="cursor-pointer hover:bg-muted/50" onClick={() => loadTestCase(key)}>
                  <CardContent className="pt-4">
                    <h3 className="font-medium mb-2 capitalize">{key}</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="font-mono">{testCase.pattern}</p>
                      <p className="font-mono">{testCase.actual}</p>
                      <p className="text-xs truncate">{JSON.stringify(testCase.expected)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            <div className="border rounded-md p-4 bg-muted/50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Extracted Parameters</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(JSON.stringify(extractedParams, null, 2))}
                  disabled={!extractedParams}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <pre className="bg-background p-3 rounded-md text-sm overflow-auto max-h-40">
                {extractedParams ? JSON.stringify(extractedParams, null, 2) : 'No parameters extracted yet'}
              </pre>
            </div>
            
            {validation.mismatches.length > 0 && (
              <div className="border border-red-200 rounded-md p-4 bg-red-50">
                <h3 className="font-medium text-red-700 mb-2">Validation Issues</h3>
                <ul className="list-disc list-inside text-sm text-red-700">
                  {validation.mismatches.map((mismatch, index) => (
                    <li key={index}>{mismatch}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {validation.valid && extractedParams && (
              <div className="border border-green-200 rounded-md p-4 bg-green-50">
                <h3 className="font-medium text-green-700">Validation Passed</h3>
                <p className="text-sm text-green-700">Parameters match expected values</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
