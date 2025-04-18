import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/utils/navigation/types';
import { navigationService } from '@/services/navigation/NavigationService';

interface PreservationTestResult {
  routePattern: string;
  parameters: Record<string, string>;
  role: UserRole;
  preservedCorrectly: boolean;
  historyEntry?: {
    from: string;
    to: string;
  };
  extractedParams?: Record<string, string> | null;
  timestamp: string;
}

export const ParameterPreservationTester: React.FC = () => {
  const [pattern, setPattern] = useState('/content/:contentType/:documentId');
  const [params, setParams] = useState<Record<string, string>>({
    contentType: 'article',
    documentId: 'doc-123'
  });
  const [selectedRole, setSelectedRole] = useState<UserRole>('writer');
  const [results, setResults] = useState<PreservationTestResult[]>([]);
  const [paramName, setParamName] = useState('');
  const [paramValue, setParamValue] = useState('');
  
  const generatePath = () => {
    return pattern.split('/')
      .map(segment => {
        if (segment.startsWith(':')) {
          const paramName = segment.substring(1);
          return params[paramName] || '';
        }
        return segment;
      })
      .join('/');
  };
  
  const addParameter = () => {
    if (!paramName) return;
    
    setParams(prev => ({
      ...prev,
      [paramName]: paramValue
    }));
    
    setParamName('');
    setParamValue('');
  };
  
  const removeParameter = (name: string) => {
    setParams(prev => {
      const newParams = { ...prev };
      delete newParams[name];
      return newParams;
    });
  };
  
  const runTest = () => {
    const actualPath = generatePath();
    
    navigationService.logNavigationEvent(
      '/previous-path',
      actualPath,
      true,
      selectedRole
    );
    
    const historyEntries = navigationService.getRecentNavigationHistory(1);
    const latestEntry = historyEntries[0];
    
    const extractedParams = navigationService.extractRouteParameters(pattern, actualPath);
    
    const paramsMatch = extractedParams 
      ? Object.entries(params).every(([key, value]) => extractedParams[key] === value)
      : false;
    
    const result: PreservationTestResult = {
      routePattern: pattern,
      parameters: { ...params },
      role: selectedRole,
      preservedCorrectly: paramsMatch,
      historyEntry: latestEntry ? {
        from: latestEntry.from,
        to: latestEntry.to
      } : undefined,
      extractedParams,
      timestamp: new Date().toISOString()
    };
    
    setResults(prev => [result, ...prev]);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parameter Preservation Tester</CardTitle>
        <CardDescription>
          Test whether parameters are preserved during navigation and role transitions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Route Pattern</label>
            <Input 
              value={pattern} 
              onChange={e => setPattern(e.target.value)}
              placeholder="e.g., /content/:type/:id"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">User Role</label>
            <Select
              value={selectedRole || ''}
              onValueChange={value => setSelectedRole(value as UserRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="writer">Writer</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Parameters</h3>
            <div className="text-xs text-muted-foreground">
              {Object.keys(params).length} parameters defined
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]">
            {Object.entries(params).map(([name, value]) => (
              <Badge key={name} variant="outline" className="flex gap-1 items-center">
                <span className="font-medium">{name}:</span> {value}
                <button 
                  className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                  onClick={() => removeParameter(name)}
                >
                  ×
                </button>
              </Badge>
            ))}
            {Object.keys(params).length === 0 && (
              <div className="text-sm text-muted-foreground">No parameters defined</div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Input 
              placeholder="Parameter name" 
              value={paramName} 
              onChange={e => setParamName(e.target.value)}
            />
            <Input 
              placeholder="Parameter value" 
              value={paramValue} 
              onChange={e => setParamValue(e.target.value)}
            />
            <Button variant="outline" onClick={addParameter}>Add</Button>
          </div>
        </div>
        
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-sm font-medium">Generated Path:</div>
            <code className="px-2 py-1 bg-muted rounded text-sm">{generatePath()}</code>
          </div>
          
          <Button onClick={runTest} className="w-full">Run Preservation Test</Button>
        </div>
        
        {results.length > 0 && (
          <div className="space-y-2 pt-4">
            <h3 className="font-medium">Test Results</h3>
            <div className="border rounded-md overflow-auto max-h-96">
              {results.map((result, index) => (
                <div key={index} className="border-b p-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={result.preservedCorrectly ? "default" : "destructive"}>
                      {result.preservedCorrectly ? "Preserved" : "Failed"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div><span className="font-medium">Pattern:</span> {result.routePattern}</div>
                    <div><span className="font-medium">Role:</span> {result.role}</div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Original Parameters</div>
                        <pre className="bg-muted p-2 rounded-md text-xs overflow-auto">
                          {JSON.stringify(result.parameters, null, 2)}
                        </pre>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Extracted Parameters</div>
                        <pre className="bg-muted p-2 rounded-md text-xs overflow-auto">
                          {JSON.stringify(result.extractedParams, null, 2)}
                        </pre>
                      </div>
                    </div>
                    
                    {result.historyEntry && (
                      <div>
                        <span className="font-medium">History Entry:</span>{' '}
                        <span className="text-sm">
                          {result.historyEntry.from} → {result.historyEntry.to}
                        </span>
                      </div>
                    )}
                    
                    {!result.preservedCorrectly && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertDescription>
                          Parameters were not preserved correctly!
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
