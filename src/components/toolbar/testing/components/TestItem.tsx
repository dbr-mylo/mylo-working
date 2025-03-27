
import React from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { TestItem as TestItemType } from '../hooks/usePersistentTestResults';
import { TestStatusButtons } from './TestStatusButtons';

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
  return (
    <Card key={test.id} className="p-4">
      <div className="flex items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="font-medium text-md">{test.id}: {test.description}</span>
            <Badge variant="outline" className="ml-2">
              {test.category}
            </Badge>
            <Badge variant="outline" className="ml-2">
              {test.priority} priority
            </Badge>
            <Badge className={`ml-2 ${getStatusBadgeColor(test.status)}`}>
              {test.status}
            </Badge>
          </div>
          
          <Textarea 
            placeholder="Add test notes here..."
            value={test.notes}
            onChange={(e) => updateTestNotes(test.id, e.target.value)}
            className="min-h-[80px] mb-2"
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
