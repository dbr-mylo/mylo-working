
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock } from 'lucide-react';

export interface TestResult {
  pattern: string;
  actualPath: string;
  params: Record<string, string>;
  missingRequired: string[];
  errors: string[];
  builtUrl?: string;
  isValid: boolean;
  validationErrors?: string[];
  performance?: {
    extractionTime: number;
    validationTime?: number;
  };
  timestamp: string;
}

interface TestResultsProps {
  results: TestResult[];
}

export const TestResults: React.FC<TestResultsProps> = ({ results }) => {
  if (results.length === 0) return null;

  const latestResult = results[0];

  return (
    <div className="border p-4 rounded-md bg-muted/50">
      <h3 className="font-medium mb-2">Latest Result</h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Badge variant={latestResult.isValid ? "default" : "destructive"}>
            {latestResult.isValid ? "Valid" : "Invalid"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {new Date(latestResult.timestamp).toLocaleTimeString()}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div><span className="text-sm font-medium">Pattern:</span> <span className="text-sm">{latestResult.pattern}</span></div>
          <div><span className="text-sm font-medium">Path:</span> <span className="text-sm">{latestResult.actualPath}</span></div>
        </div>
        
        {latestResult.builtUrl && (
          <div>
            <span className="text-sm font-medium">Built URL:</span> <span className="text-sm">{latestResult.builtUrl}</span>
            {latestResult.builtUrl !== latestResult.actualPath && (
              <Badge variant="outline" className="ml-2">Differs</Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Extraction: {latestResult.performance?.extractionTime.toFixed(2)}ms
            {latestResult.performance?.validationTime !== undefined && 
              `, Validation: ${latestResult.performance?.validationTime.toFixed(2)}ms`
            }
          </span>
        </div>

        {latestResult.missingRequired.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              Missing required parameters: {latestResult.missingRequired.join(', ')}
            </AlertDescription>
          </Alert>
        )}
        
        {latestResult.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              {latestResult.errors.join('\n')}
            </AlertDescription>
          </Alert>
        )}
        
        {latestResult.validationErrors && latestResult.validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              <div className="font-medium mb-1">Validation Errors:</div>
              <ul className="list-disc pl-5 space-y-1">
                {latestResult.validationErrors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};
