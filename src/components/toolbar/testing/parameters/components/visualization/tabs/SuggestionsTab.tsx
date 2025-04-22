
import React from 'react';
import { QuickFixSuggestions } from '../../validation/QuickFixSuggestions';
import { XCircle } from 'lucide-react';
import { ErrorResolutionSuggestion } from '@/utils/navigation/parameters/errorResolutionSuggester';

interface SuggestionsTabProps {
  suggestions: Record<string, ErrorResolutionSuggestion[]>;
  params: Record<string, string>;
  onApplySuggestion?: (paramName: string, value: string) => void;
}

export const SuggestionsTab: React.FC<SuggestionsTabProps> = ({
  suggestions,
  params,
  onApplySuggestion
}) => {
  if (Object.keys(suggestions).length === 0) {
    return (
      <div className="p-8 text-center">
        <XCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-30" />
        <p className="text-muted-foreground">No suggestions available</p>
      </div>
    );
  }

  return (
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
  );
};
