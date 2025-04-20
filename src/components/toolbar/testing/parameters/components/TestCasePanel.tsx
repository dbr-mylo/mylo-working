
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { TestCase } from '../constants/testCases';

interface TestCasePanelProps {
  pattern: string;
  path: string;
  onPatternChange: (value: string) => void;
  onPathChange: (value: string) => void;
  onRunTest: () => void;
  testCases: TestCase[];
  onRunTestCase: (testCase: TestCase) => void;
}

export const TestCasePanel: React.FC<TestCasePanelProps> = ({
  pattern,
  path,
  onPatternChange,
  onPathChange,
  onRunTest,
  testCases,
  onRunTestCase
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Route Pattern</label>
        <Input 
          value={pattern} 
          onChange={e => onPatternChange(e.target.value)}
          placeholder="/path/:param1/:param2?/:param3"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Use ? suffix for optional parameters, nested parameters should follow their parent
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Actual Path</label>
        <Input 
          value={path} 
          onChange={e => onPathChange(e.target.value)}
          placeholder="/path/value1/value2/value3"
        />
      </div>
      
      <Button onClick={onRunTest} className="w-full">Test Parameters</Button>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Test Cases</h3>
        <div className="space-y-2">
          {testCases.map((testCase, index) => (
            <div 
              key={index}
              className="flex justify-between items-center p-3 border rounded-md hover:bg-accent/50 cursor-pointer"
              onClick={() => onRunTestCase(testCase)}
            >
              <div>
                <div className="font-medium">{testCase.name}</div>
                <div className="text-xs text-muted-foreground">
                  {testCase.pattern} → {testCase.path}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
