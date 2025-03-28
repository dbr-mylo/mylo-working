
import React from 'react';
import { TestItem } from '../hooks/usePersistentTestResults';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { CalendarIcon, ClockIcon, UserIcon } from 'lucide-react';

interface TestDetailsProps {
  test: TestItem;
}

export const TestDetails: React.FC<TestDetailsProps> = ({ test }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="details">
        <AccordionTrigger className="text-sm">Test Details</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1 text-muted-foreground">
                <CalendarIcon className="h-3 w-3" />
                <span>Last updated:</span>
              </div>
              <div>{test.lastUpdated ? new Date(test.lastUpdated).toLocaleString() : 'Never'}</div>
              
              <div className="flex items-center gap-1 text-muted-foreground">
                <UserIcon className="h-3 w-3" />
                <span>Tested by:</span>
              </div>
              <div>{test.testedBy || 'Unknown'}</div>
              
              <div className="flex items-center gap-1 text-muted-foreground">
                <ClockIcon className="h-3 w-3" />
                <span>Test duration:</span>
              </div>
              <div>{test.duration ? `${test.duration}ms` : 'Not measured'}</div>
            </div>
            
            {test.expectedResult && (
              <div>
                <p className="text-muted-foreground mb-1">Expected Result:</p>
                <p className="pl-2 border-l-2 border-muted">{test.expectedResult}</p>
              </div>
            )}
            
            {test.actualResult && (
              <div>
                <p className="text-muted-foreground mb-1">Actual Result:</p>
                <p className="pl-2 border-l-2 border-muted">{test.actualResult}</p>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
