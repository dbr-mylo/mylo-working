
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { ErrorResolutionSuggestion } from '@/utils/navigation/parameters/errorResolutionSuggester';

interface QuickFixSuggestionsProps {
  paramName: string;
  currentValue: string;
  suggestions: ErrorResolutionSuggestion[];
  onApplySuggestion: (paramName: string, value: string) => void;
}

export const QuickFixSuggestions: React.FC<QuickFixSuggestionsProps> = ({
  paramName,
  currentValue,
  suggestions,
  onApplySuggestion
}) => {
  return (
    <Card className="border border-amber-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold">{paramName}</div>
          <Badge variant="outline">Current: {currentValue || '(empty)'}</Badge>
        </div>
        
        <div className="space-y-3">
          {suggestions.map((suggestion, idx) => (
            <div key={idx} className="space-y-1">
              <div className={`text-sm ${getSeverityColor(suggestion.severity)}`}>
                {suggestion.errorMessage}
              </div>
              <p className="text-sm text-muted-foreground">{suggestion.suggestionText}</p>
              
              {suggestion.exampleFix && (
                <div className="flex items-center mt-1">
                  <Badge variant="secondary" className="mr-2">
                    {suggestion.exampleFix}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-6"
                    onClick={() => onApplySuggestion(paramName, suggestion.exampleFix)}
                  >
                    <ArrowRight className="h-3 w-3 mr-1" />
                    Apply
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const getSeverityColor = (severity: 'critical' | 'warning' | 'info'): string => {
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
};
