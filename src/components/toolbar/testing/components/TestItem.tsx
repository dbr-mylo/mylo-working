
import React from 'react';
import { Card } from '@/components/ui/card';
import { TestItem as TestItemType } from '../hooks/usePersistentTestResults';
import { TestStatusButtons } from './TestStatusButtons';
import { TestItemHeader } from './TestItemHeader';
import { TestNotes } from './TestNotes';

interface TestItemProps {
  test: TestItemType;
  updateTestStatus: (id: string, status: 'passed' | 'failed' | 'untested') => void;
  updateTestNotes: (id: string, notes: string) => void;
  getStatusBadgeColor: (status: string) => string;
}

export const TestItemComponent: React.FC<TestItemProps> = ({
  test,
  updateTestStatus,
  updateTestNotes,
  getStatusBadgeColor
}) => {
  const handleNotesChange = (notes: string) => {
    updateTestNotes(test.id, notes);
  };

  return (
    <Card key={test.id} className="p-4">
      <div className="flex items-start">
        <div className="flex-1">
          <TestItemHeader 
            test={test} 
            getStatusBadgeColor={getStatusBadgeColor} 
          />
          
          <TestNotes 
            notes={test.notes} 
            onChange={handleNotesChange} 
          />
          
          <TestStatusButtons 
            id={test.id}
            currentStatus={test.status}
            updateTestStatus={updateTestStatus}
          />
        </div>
      </div>
    </Card>
  );
};
