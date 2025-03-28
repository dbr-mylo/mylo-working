
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TestItem } from '../hooks/usePersistentTestResults';

interface TestItemHeaderProps {
  test: TestItem;
  getStatusBadgeColor: (status: string) => string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const TestItemHeader: React.FC<TestItemHeaderProps> = ({
  test,
  getStatusBadgeColor,
  isCollapsed = false,
  onToggleCollapse
}) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center flex-wrap gap-2">
        <span className="font-medium text-md">{test.id}: {test.description}</span>
        <Badge variant="outline">
          {test.category}
        </Badge>
        <Badge variant="outline">
          {test.priority} priority
        </Badge>
        <Badge className={getStatusBadgeColor(test.status)}>
          {test.status}
        </Badge>
      </div>
      
      {onToggleCollapse && (
        <button 
          onClick={onToggleCollapse}
          className="p-1 hover:bg-muted rounded-full"
          aria-label={isCollapsed ? "Expand test" : "Collapse test"}
        >
          {isCollapsed ? 
            <ChevronDown className="h-4 w-4" /> : 
            <ChevronUp className="h-4 w-4" />
          }
        </button>
      )}
    </div>
  );
};
