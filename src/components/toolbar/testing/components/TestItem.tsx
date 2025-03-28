
import React, { useState } from 'react';
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleNotesChange = (notes: string) => {
    updateTestNotes(test.id, notes);
  };
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Card key={test.id} className="p-4">
      <div className="flex flex-col">
        <TestItemHeader 
          test={test} 
          getStatusBadgeColor={getStatusBadgeColor}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />
        
        {!isCollapsed && (
          <>
            <TestNotes 
              notes={test.notes} 
              onChange={handleNotesChange}
              maxLength={500}
            />
            
            <TestStatusButtons 
              id={test.id}
              currentStatus={test.status}
              updateTestStatus={updateTestStatus}
            />
          </>
        )}
      </div>
    </Card>
  );
};

// For backward compatibility
export { TestItemComponent as TestItem };
