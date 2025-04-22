
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ValidationSummary } from '../validation/ValidationSummary';
import { ParameterDetails } from '../validation/ParameterDetails';
import { QuickFixSuggestions } from '../validation/QuickFixSuggestions';
import { generateErrorSuggestionsFromResults } from '@/utils/navigation/parameters/errorResolutionSuggester';
import { XCircle } from 'lucide-react';
import type { ParameterDefinition } from '../../types';

interface EnhancedValidationErrorVisualizerProps {
  errors: string[];
  warnings?: string[];
  params: Record<string, string>;
  rules?: Record<string, ParameterDefinition>;
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
  
  const errorsByParam: Record<string, string[]> = {};
  errors.forEach(error => {
    const paramMatch = error.match(/Parameter\s+(\w+)/i);
    if (paramMatch && paramMatch[1]) {
      const paramName = paramMatch[1];
      if (!errorsByParam[paramName]) {
        errorsByParam[paramName] = [];
      }
      errorsByParam[paramName].push(error);
    }
  });
  
  const validParamsCount = Object.keys(params).filter(param => !errorsByParam[param]?.length).length;
  const invalidParamsCount = Object.keys(errorsByParam).length;
  const totalParamsCount = Object.keys(params).length;
  
  const suggestions = generateErrorSuggestionsFromResults(
    [...Object.entries(errorsByParam)].map(([param, errors]) => ({
      isValid: false,
      errorMessage: errors[0]
    })),
    params
  );
  
  const criticalErrors = countSuggestionsBySeverity(suggestions, 'critical');
  const warningErrors = countSuggestionsBySeverity(suggestions, 'warning');
  const infoErrors = countSuggestionsBySeverity(suggestions, 'info');
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <ValidationSummary 
            totalParams={totalParamsCount}
            validParams={validParamsCount}
            invalidParams={invalidParamsCount}
            criticalErrors={criticalErrors}
            warningErrors={warningErrors}
            infoErrors={infoErrors}
          />
        </TabsContent>
        
        <TabsContent value="parameters">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.keys(params).map(paramName => (
              <ParameterDetails
                key={paramName}
                paramName={paramName}
                value={params[paramName]}
                errors={errorsByParam[paramName] || []}
                rule={rules[paramName]}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="suggestions">
          {Object.keys(suggestions).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(suggestions).map(([paramName, paramSuggestions]) => (
                <QuickFixSuggestions
                  key={paramName}
                  paramName={paramName}
                  currentValue={params[paramName]}
                  suggestions={paramSuggestions}
                  onApplySuggestion={onApplySuggestion || (() => {})}
                />
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

const countSuggestionsBySeverity = (suggestions: Record<string, any[]>, severity: string): number => {
  return Object.values(suggestions).reduce((count, paramSuggestions) => {
    return count + paramSuggestions.filter(s => s.severity === severity).length;
  }, 0);
};
