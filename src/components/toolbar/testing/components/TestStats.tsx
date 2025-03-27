
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TestStatsProps {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  untestedTests: number;
}

export const TestStats: React.FC<TestStatsProps> = ({
  totalTests,
  passedTests,
  failedTests,
  untestedTests
}) => {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="ml-2">
        {totalTests} Tests
      </Badge>
      <Badge className="bg-green-500">
        Passed: {passedTests}
      </Badge>
      <Badge className="bg-red-500">
        Failed: {failedTests}
      </Badge>
      <Badge className="bg-yellow-500">
        Untested: {untestedTests}
      </Badge>
    </div>
  );
};
