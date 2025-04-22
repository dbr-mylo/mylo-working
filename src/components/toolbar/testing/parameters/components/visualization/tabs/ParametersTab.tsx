
import React from 'react';
import { ParameterDetails } from '../../validation/ParameterDetails';
import type { ParameterDefinition } from '../../../types';

interface ParametersTabProps {
  params: Record<string, string>;
  errorsByParam: Record<string, string[]>;
  rules?: Record<string, ParameterDefinition>;
}

export const ParametersTab: React.FC<ParametersTabProps> = ({
  params,
  errorsByParam,
  rules
}) => {
  return (
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
  );
};
