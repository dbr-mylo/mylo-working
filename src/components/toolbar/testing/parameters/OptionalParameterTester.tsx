
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { extractOptionalParameters, validateOptionalParameters, OptionalParameterConfig } from '@/utils/navigation/parameters/optionalParameterHandler';

interface TestResult {
  pattern: string;
  actualPath: string;
  params: Record<string, string>;
  missingRequired: string[];
  errors: string[];
  isValid: boolean;
  timestamp: string;
}

export const OptionalParameterTester = () => {
  const [pattern, setPattern] = useState('/user/:id?/profile/:section?');
  const [actualPath, setActualPath] = useState('/user/123/profile');
  const [results, setResults] = useState<TestResult[]>([]);
  
  const runTest = () => {
    // Extract parameters
    const extracted = extractOptionalParameters(pattern, actualPath);
    
    // Create test configuration
    const config: Record<string, OptionalParameterConfig> = {};
    pattern.split('/').forEach(part => {
      if (part.startsWith(':')) {
        const isOptional = part.endsWith('?');
        const paramName = part.slice(1, isOptional ? -1 : undefined);
        config[paramName] = {
          isRequired: !isOptional,
          defaultValue: isOptional ? '' : undefined
        };
      }
    });
    
    // Validate parameters
    const isValid = validateOptionalParameters(extracted.params, config);
    
    const result: TestResult = {
      pattern,
      actualPath,
      params: extracted.params,
      missingRequired: extracted.missingRequired,
      errors: extracted.errors,
      isValid,
      timestamp: new Date().toISOString()
    };
    
    setResults(prev => [result, ...prev]);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Optional Parameter Tester</CardTitle>
        <CardDescription>
          Test handling of optional route parameters and their extraction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium">Route Pattern</label>
            <Input 
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              placeholder="e.g., /user/:id?/profile/:section?"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Use ? to mark optional parameters (e.g., :id?)
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Actual Path</label>
            <Input 
              value={actualPath}
              onChange={e => setActualPath(e.target.value)}
              placeholder="e.g., /user/123/profile"
            />
          </div>
          
          <Button onClick={runTest}>Run Test</Button>
        </div>
        
        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Test Results</h3>
            <div className="border rounded-lg divide-y">
              {results.map((result, index) => (
                <div key={index} className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant={result.isValid ? "default" : "destructive"}>
                      {result.isValid ? "Valid" : "Invalid"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div><span className="font-medium">Pattern:</span> {result.pattern}</div>
                    <div><span className="font-medium">Path:</span> {result.actualPath}</div>
                    
                    <div>
                      <span className="font-medium">Extracted Parameters:</span>
                      <pre className="mt-1 bg-muted p-2 rounded-md text-xs">
                        {JSON.stringify(result.params, null, 2)}
                      </pre>
                    </div>
                    
                    {result.missingRequired.length > 0 && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          Missing required parameters: {result.missingRequired.join(', ')}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {result.errors.length > 0 && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {result.errors.join('\n')}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

