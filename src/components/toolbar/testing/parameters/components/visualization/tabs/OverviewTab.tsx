
import React from 'react';
import { ValidationSummary } from '../../validation/ValidationSummary';

interface OverviewTabProps {
  totalParams: number;
  validParams: number;
  invalidParams: number;
  criticalErrors: number;
  warningErrors: number;
  infoErrors: number;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  totalParams,
  validParams,
  invalidParams,
  criticalErrors,
  warningErrors,
  infoErrors
}) => {
  return (
    <ValidationSummary
      totalParams={totalParams}
      validParams={validParams}
      invalidParams={invalidParams}
      criticalErrors={criticalErrors}
      warningErrors={warningErrors}
      infoErrors={infoErrors}
    />
  );
};
