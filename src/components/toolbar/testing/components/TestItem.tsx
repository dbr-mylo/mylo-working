
import React from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { TestItem as TestItemType } from '../hooks/usePersistentTestResults';

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
          
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              variant={test.status === 'passed' ? 'default' : 'outline'} 
              className="flex items-center" 
              onClick={() => updateTestStatus(test.id, 'passed')}
            >
              <Check className="w-4 h-4 mr-1" />
              Pass
            </Button>
            
            <Button 
              size="sm" 
              variant={test.status === 'failed' ? 'destructive' : 'outline'} 
              onClick={() => updateTestStatus(test.id, 'failed')}
            >
              Fail
            </Button>
            
            <Button 
              size="sm" 
              variant={test.status === 'untested' ? 'secondary' : 'outline'} 
              onClick={() => updateTestStatus(test.id, 'untested')}
            >
              Mark Untested
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
