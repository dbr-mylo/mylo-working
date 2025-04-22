
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check } from 'lucide-react';
import { ParameterDefinition } from '../../types';

interface ParameterDetailsProps {
  paramName: string;
  value: string;
  errors: string[];
  rule?: ParameterDefinition;
}

export const ParameterDetails: React.FC<ParameterDetailsProps> = ({
  paramName,
  value,
  errors,
  rule
}) => {
  const hasError = errors.length > 0;

  return (
    <Card className={`border ${hasError ? 'border-red-200' : 'border-green-200'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">{paramName}</span>
          {hasError ? (
            <Badge variant="destructive" className="flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              Invalid
            </Badge>
          ) : (
            <Badge variant="default" className="flex items-center">
              <Check className="h-3 w-3 mr-1" />
              Valid
            </Badge>
          )}
        </div>
        
        <div className="mt-2 text-sm">
          <div className="flex items-center">
            <span className="text-muted-foreground mr-2">Value:</span>
            <Badge variant="outline">{value || '(empty)'}</Badge>
          </div>
          
          {rule && (
            <div className="mt-1 text-xs text-muted-foreground space-x-2">
              {rule.isRequired && <Badge variant="secondary">Required</Badge>}
              {rule.type && <Badge variant="secondary">Type: {rule.type}</Badge>}
              {rule.validation?.minLength && (
                <Badge variant="secondary">Min: {rule.validation.minLength}</Badge>
              )}
              {rule.validation?.maxLength && (
                <Badge variant="secondary">Max: {rule.validation.maxLength}</Badge>
              )}
              {rule.validation?.pattern && <Badge variant="secondary">Has pattern</Badge>}
            </div>
          )}
        </div>
        
        {hasError && (
          <div className="mt-2 space-y-1">
            {errors.map((error, i) => (
              <p key={i} className="text-xs text-red-500">{error}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
