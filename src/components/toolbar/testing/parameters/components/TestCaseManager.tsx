
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Save, RefreshCw } from 'lucide-react';

export interface SavedTestCase {
  name: string;
  pattern: string;
  actualPath: string;
}

interface TestCaseManagerProps {
  testCases: SavedTestCase[];
  testCaseName: string;
  pattern: string;
  actualPath: string;
  onTestCaseNameChange: (name: string) => void;
  onSaveTestCase: () => void;
  onLoadTestCase: (testCase: SavedTestCase) => void;
  onDeleteTestCase: (index: number) => void;
}

export const TestCaseManager: React.FC<TestCaseManagerProps> = ({
  testCases,
  testCaseName,
  pattern,
  actualPath,
  onTestCaseNameChange,
  onSaveTestCase,
  onLoadTestCase,
  onDeleteTestCase
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input 
          value={testCaseName}
          onChange={e => onTestCaseNameChange(e.target.value)}
          placeholder="Test case name"
        />
        <Button onClick={onSaveTestCase} disabled={!testCaseName}>
          <Save className="mr-2 h-4 w-4" />
          Save Case
        </Button>
      </div>

      <div className="border rounded-md divide-y">
        {testCases.map((testCase, index) => (
          <div key={index} className="p-3 flex justify-between items-center">
            <div>
              <div className="font-medium">{testCase.name}</div>
              <div className="text-sm text-muted-foreground">
                Pattern: {testCase.pattern}
              </div>
              <div className="text-sm text-muted-foreground">
                Path: {testCase.actualPath}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={() => onLoadTestCase(testCase)}>
                Load
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDeleteTestCase(index)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
        {testCases.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            No saved test cases yet. Save some test cases to see them here.
          </div>
        )}
      </div>
    </div>
  );
};
