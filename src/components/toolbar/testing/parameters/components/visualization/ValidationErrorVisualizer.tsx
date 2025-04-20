
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, AlertTriangle } from 'lucide-react';

interface ValidationErrorVisualizerProps {
  errors: string[];
  warnings?: string[];
  params: Record<string, string>;
  rules?: Record<string, any>;
}

export const ValidationErrorVisualizer: React.FC<ValidationErrorVisualizerProps> = ({ 
  errors, 
  warnings = [], 
  params,
  rules = {}
}) => {
  // Group errors by parameter name
  const errorsByParam: Record<string, string[]> = {};
  const generalErrors: string[] = [];
  
  errors.forEach(error => {
    // Try to extract parameter name from error message
    const paramMatch = error.match(/Parameter\s+(\w+)/i);
    if (paramMatch && paramMatch[1]) {
      const paramName = paramMatch[1];
      if (!errorsByParam[paramName]) {
        errorsByParam[paramName] = [];
      }
      errorsByParam[paramName].push(error);
    } else {
      generalErrors.push(error);
    }
  });

  return (
    <div className="space-y-4">
      {/* Parameter status overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.keys(params).map(param => {
          const hasError = errorsByParam[param]?.length > 0;
          const paramRule = rules[param];
          
          return (
            <Card key={param} className={`border ${hasError ? 'border-red-200' : 'border-green-200'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{param}</span>
                  {hasError ? (
                    <Badge variant="destructive">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Invalid
                    </Badge>
                  ) : (
                    <Badge variant="default">
                      <Check className="h-3 w-3 mr-1" />
                      Valid
                    </Badge>
                  )}
                </div>
                
                <div className="mt-2 text-sm">
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-2">Value:</span>
                    <Badge variant="outline">{params[param] || '(empty)'}</Badge>
                  </div>
                  
                  {paramRule && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {paramRule.required && <span className="mr-2">Required</span>}
                      {paramRule.type && <span className="mr-2">Type: {paramRule.type}</span>}
                      {paramRule.minLength && <span className="mr-2">Min: {paramRule.minLength}</span>}
                      {paramRule.maxLength && <span className="mr-2">Max: {paramRule.maxLength}</span>}
                      {paramRule.pattern && <span>Has pattern</span>}
                    </div>
                  )}
                </div>
                
                {hasError && (
                  <div className="mt-2">
                    {errorsByParam[param].map((error, i) => (
                      <p key={i} className="text-xs text-red-500">{error}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* General errors */}
      {generalErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>General Validation Errors</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside text-sm">
              {generalErrors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Warnings */}
      {warnings.length > 0 && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warnings</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside text-sm">
              {warnings.map((warning, i) => (
                <li key={i}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Success state */}
      {errors.length === 0 && warnings.length === 0 && (
        <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4" />
          <AlertTitle>All Parameters Valid</AlertTitle>
          <AlertDescription>
            No validation errors or warnings detected.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
