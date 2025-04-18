
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { navigationService } from '@/services/navigation/NavigationService';

interface TestResult {
  routePattern: string;
  actualPath: string;
  params: Record<string, string> | null;
  isValid: boolean;
  timestamp: string;
  errors?: string[];
}

const MissingParameterTester: React.FC = () => {
  const [routePattern, setRoutePattern] = useState('/:section/:id/:action?');
  const [actualPath, setActualPath] = useState('/content//edit');
  const [results, setResults] = useState<TestResult[]>([]);

  // Common test patterns
  const testPatterns = [
    { name: 'Missing Required', pattern: '/user/:id/profile', path: '/user//profile' },
    { name: 'Multiple Missing', pattern: '/:section/:id/:action', path: '//123/' },
    { name: 'Optional Missing', pattern: '/post/:id?/comments/:commentId?', path: '/post//comments/' },
    { name: 'Parameter Name Conflict', pattern: '/user/:id/posts/:id', path: '/user/123/posts/456' },
  ];

  const runTest = () => {
    try {
      // Extract params using the navigation service
      const params = navigationService.extractRouteParameters(routePattern, actualPath);
      
      // Create a result
      const result: TestResult = {
        routePattern,
        actualPath,
        params,
        isValid: params !== null,
        timestamp: new Date().toISOString(),
      };
      
      setResults(prev => [result, ...prev]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Create a failed result
      const result: TestResult = {
        routePattern,
        actualPath,
        params: null,
        isValid: false,
        timestamp: new Date().toISOString(),
        errors: [errorMessage]
      };
      
      setResults(prev => [result, ...prev]);
    }
  };

  const applyTestPattern = (pattern: string, path: string) => {
    setRoutePattern(pattern);
    setActualPath(path);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Missing Parameter Tester</CardTitle>
        <CardDescription>
          Test handling of missing, optional, or conflicting route parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Route Pattern</label>
            <Input
              value={routePattern}
              onChange={e => setRoutePattern(e.target.value)}
              placeholder="e.g., /user/:id/profile"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Actual Path</label>
            <Input
              value={actualPath}
              onChange={e => setActualPath(e.target.value)}
              placeholder="e.g., /user//profile"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Common Test Patterns</label>
          <div className="flex flex-wrap gap-2">
            {testPatterns.map((test, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => applyTestPattern(test.pattern, test.path)}
              >
                {test.name}
              </Button>
            ))}
          </div>
        </div>

        <Button onClick={runTest}>Run Test</Button>

        {results.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Test Results</h3>
            <div className="border rounded-md overflow-auto max-h-96">
              {results.map((result, index) => (
                <div key={index} className="border-b p-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {result.isValid ? (
                        <CheckCircle className="text-green-500 h-5 w-5" />
                      ) : (
                        <AlertCircle className="text-red-500 h-5 w-5" />
                      )}
                      <span className={result.isValid ? "text-green-600" : "text-red-600"}>
                        {result.isValid ? "Valid" : "Invalid"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div><span className="font-medium">Pattern:</span> {result.routePattern}</div>
                    <div><span className="font-medium">Path:</span> {result.actualPath}</div>

                    {result.params !== null ? (
                      <div>
                        <div className="font-medium">Extracted Parameters:</div>
                        <pre className="bg-muted p-2 rounded-md text-xs overflow-auto">
                          {JSON.stringify(result.params, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div className="text-red-600">No parameters could be extracted</div>
                    )}

                    {result.errors && result.errors.length > 0 && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          <ul className="list-disc ml-4">
                            {result.errors.map((error, i) => (
                              <li key={i}>{error}</li>
                            ))}
                          </ul>
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

export default MissingParameterTester;
