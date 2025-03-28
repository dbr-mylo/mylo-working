
import React from 'react';
import { TestItem } from '../hooks/usePersistentTestResults';
import { Card, CardContent } from '@/components/ui/card';

interface TestDetailsProps {
  test: TestItem;
}

export const TestDetails: React.FC<TestDetailsProps> = ({ test }) => {
  return (
    <Card className="mt-4">
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Priority:</span> {test.priority}
          </div>
          <div>
            <span className="font-semibold">Category:</span> {test.category}
          </div>
          {test.expectedResult && (
            <div>
              <span className="font-semibold">Expected Result:</span> {test.expectedResult}
            </div>
          )}
          {test.actualResult && (
            <div>
              <span className="font-semibold">Actual Result:</span> {test.actualResult}
            </div>
          )}
          {test.lastUpdated && (
            <div>
              <span className="font-semibold">Last Updated:</span> {new Date(test.lastUpdated).toLocaleString()}
            </div>
          )}
          {test.testedBy && (
            <div>
              <span className="font-semibold">Tested By:</span> {test.testedBy}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
