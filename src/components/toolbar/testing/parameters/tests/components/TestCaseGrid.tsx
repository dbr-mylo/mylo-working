
import React from 'react';
import { TestCase } from '../testCases';

interface TestCaseGridProps {
  testCases: TestCase[];
  selectedTest: string | null;
  onRunTest: (testCase: TestCase) => void;
}

export const TestCaseGrid: React.FC<TestCaseGridProps> = ({ 
  testCases,
  selectedTest,
  onRunTest
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {testCases.map((test, index) => (
        <div 
          key={index}
          className="border rounded-md p-4 hover:bg-accent/20 cursor-pointer"
          onClick={() => {
            if (!selectedTest) onRunTest(test);
          }}
        >
          <h3 className="font-medium mb-2">{test.name}</h3>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Pattern: <span className="font-mono">{test.pattern}</span></p>
            <p>Path: <span className="font-mono">{test.path}</span></p>
          </div>
          {selectedTest === test.name && (
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <span className="animate-spin mr-1">⏳</span> Running test...
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
