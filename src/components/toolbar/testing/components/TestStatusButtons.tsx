
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface TestStatusButtonsProps {
  id: string;
  currentStatus: 'passed' | 'failed' | 'untested';
  updateTestStatus: (id: string, status: 'passed' | 'failed' | 'untested') => void;
}

export const TestStatusButtons: React.FC<TestStatusButtonsProps> = ({
  id,
  currentStatus,
  updateTestStatus
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button 
        size="sm" 
        variant={currentStatus === 'passed' ? 'default' : 'outline'} 
        className="flex items-center" 
        onClick={() => updateTestStatus(id, 'passed')}
      >
        <Check className="w-4 h-4 mr-1" />
        Pass
      </Button>
      
      <Button 
        size="sm" 
        variant={currentStatus === 'failed' ? 'destructive' : 'outline'} 
        onClick={() => updateTestStatus(id, 'failed')}
      >
        Fail
      </Button>
      
      <Button 
        size="sm" 
        variant={currentStatus === 'untested' ? 'secondary' : 'outline'} 
        onClick={() => updateTestStatus(id, 'untested')}
      >
        Mark Untested
      </Button>
    </div>
  );
};
