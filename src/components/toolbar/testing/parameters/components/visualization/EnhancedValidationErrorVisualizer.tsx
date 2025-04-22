
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateErrorSuggestionsFromResults } from '@/utils/navigation/parameters/errorResolutionSuggester';
import type { ParameterDefinition } from '../../types';
import { OverviewTab } from './tabs/OverviewTab';
import { ParametersTab } from './tabs/ParametersTab';
import { SuggestionsTab } from './tabs/SuggestionsTab';

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
  
  // Group errors by parameter name
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
          <OverviewTab
            totalParams={totalParamsCount}
            validParams={validParamsCount}
            invalidParams={invalidParamsCount}
            criticalErrors={criticalErrors}
            warningErrors={warningErrors}
            infoErrors={infoErrors}
          />
        </TabsContent>
        
        <TabsContent value="parameters">
          <ParametersTab
            params={params}
            errorsByParam={errorsByParam}
            rules={rules}
          />
        </TabsContent>
        
        <TabsContent value="suggestions">
          <SuggestionsTab
            suggestions={suggestions}
            params={params}
            onApplySuggestion={onApplySuggestion}
          />
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
