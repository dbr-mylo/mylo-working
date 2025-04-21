
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ErrorResolutionSuggestion,
  generateErrorSuggestionsFromResults
} from '@/utils/navigation/parameters/errorResolutionSuggester';

interface EnhancedValidationErrorVisualizerProps {
  errors: string[];
  warnings?: string[];
  params: Record<string, string>;
  rules?: Record<string, any>;
  onApplySuggestion?: (paramName: string, suggestedValue: string) => void;
}

export const EnhancedValidationErrorVisualizer: React.FC<EnhancedValidationErrorVisualizerProps> = ({ 
  errors, 
  warnings = [], 
  params,
  rules = {},
  onApplySuggestion
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Group errors by parameter name
  const errorsByParam: Record<string, string[]> = {};
  const generalErrors: string[] = [];
  
  // Process errors and collect them by parameter
  errors.forEach(error => {
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
  
  // Generate suggestions for fixing errors
  const suggestions = generateErrorSuggestionsFromResults(
    [...Object.entries(errorsByParam)].map(([param, errors]) => ({
      isValid: false,
      errorMessage: errors[0]
    })),
    params
  );
  
  // Count parameters by status
  const validParamsCount = Object.keys(params).filter(param => !errorsByParam[param]?.length).length;
  const invalidParamsCount = Object.keys(errorsByParam).length;
  const totalParamsCount = Object.keys(params).length;
  
  // Calculate error severity distribution for visualization
  const criticalErrors = countErrorsBySeverity(suggestions, 'critical');
  const warningErrors = countErrorsBySeverity(suggestions, 'warning');
  const infoErrors = countErrorsBySeverity(suggestions, 'info');
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Validation Summary */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold">{totalParamsCount}</div>
                  <div className="text-sm text-muted-foreground">Total Parameters</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-green-600">{validParamsCount}</div>
                  <div className="text-sm text-muted-foreground">Valid Parameters</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-red-600">{invalidParamsCount}</div>
                  <div className="text-sm text-muted-foreground">Invalid Parameters</div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Error Distribution */}
          {(criticalErrors > 0 || warningErrors > 0 || infoErrors > 0) && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-medium mb-3">Error Distribution</h3>
                <div className="space-y-2">
                  {criticalErrors > 0 && (
                    <div className="flex items-center">
                      <div className="w-24 text-xs">Critical:</div>
                      <div className="flex-1 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${(criticalErrors / (criticalErrors + warningErrors + infoErrors)) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-10 text-right text-xs">{criticalErrors}</div>
                    </div>
                  )}
                  {warningErrors > 0 && (
                    <div className="flex items-center">
                      <div className="w-24 text-xs">Warning:</div>
                      <div className="flex-1 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="bg-amber-500 h-2 rounded-full" 
                          style={{ width: `${(warningErrors / (criticalErrors + warningErrors + infoErrors)) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-10 text-right text-xs">{warningErrors}</div>
                    </div>
                  )}
                  {infoErrors > 0 && (
                    <div className="flex items-center">
                      <div className="w-24 text-xs">Info:</div>
                      <div className="flex-1 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(infoErrors / (criticalErrors + warningErrors + infoErrors)) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-10 text-right text-xs">{infoErrors}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* General Errors */}
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
          
          {/* Success State */}
          {errors.length === 0 && warnings.length === 0 && (
            <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
              <Check className="h-4 w-4" />
              <AlertTitle>All Parameters Valid</AlertTitle>
              <AlertDescription>
                No validation errors or warnings detected.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        <TabsContent value="parameters">
          {/* Parameter Status Cards */}
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
        </TabsContent>
        
        <TabsContent value="suggestions">
          {/* Error Suggestions */}
          {Object.keys(suggestions).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(suggestions).map(([paramName, paramSuggestions]) => (
                <Card key={paramName} className="border border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{paramName}</div>
                      <Badge variant="outline">Current: {params[paramName] || '(empty)'}</Badge>
                    </div>
                    
                    {paramSuggestions.map((suggestion, idx) => (
                      <div key={idx} className="mt-2 space-y-1">
                        <div className={`text-sm ${getBadgeColorForSeverity(suggestion.severity)}`}>
                          {suggestion.errorMessage}
                        </div>
                        <p className="text-sm">{suggestion.suggestionText}</p>
                        
                        {suggestion.exampleFix && onApplySuggestion && (
                          <div className="flex items-center mt-1">
                            <div className="text-xs text-muted-foreground mr-2">Suggested fix:</div>
                            <Badge variant="secondary">{suggestion.exampleFix}</Badge>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="ml-2 h-6"
                              onClick={() => onApplySuggestion(paramName, suggestion.exampleFix!)}
                            >
                              <ArrowRight className="h-3 w-3 mr-1" />
                              Apply
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <XCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-30" />
              <p className="text-muted-foreground">No suggestions available</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to count errors by severity
function countErrorsBySeverity(
  suggestions: Record<string, ErrorResolutionSuggestion[]>, 
  severity: 'critical' | 'warning' | 'info'
): number {
  return Object.values(suggestions).reduce((count, paramSuggestions) => {
    return count + paramSuggestions.filter(s => s.severity === severity).length;
  }, 0);
}

// Helper function to get appropriate text color class based on severity
function getBadgeColorForSeverity(severity: 'critical' | 'warning' | 'info'): string {
  switch (severity) {
    case 'critical':
      return 'text-red-600 font-medium';
    case 'warning':
      return 'text-amber-600';
    case 'info':
      return 'text-blue-600';
    default:
      return '';
  }
}
