
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TestItem } from '../hooks/usePersistentTestResults';

interface TestItemHeaderProps {
  test: TestItem;
  getStatusBadgeColor: (status: string) => string;
}

export const TestItemHeader: React.FC<TestItemHeaderProps> = ({
  test,
  getStatusBadgeColor
}) => {
  return (
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
  );
};
