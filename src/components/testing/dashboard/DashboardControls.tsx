
import React from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface DashboardControlsProps {
  testEnabled: boolean;
  toggleTests: () => void;
  clearResults: () => void;
  runErrorTest: () => void;
  runAllTests: () => void;
  canRunDestructiveTests: boolean;
}

export const DashboardControls: React.FC<DashboardControlsProps> = ({
  testEnabled,
  toggleTests,
  clearResults,
  runErrorTest,
  runAllTests,
  canRunDestructiveTests
}) => {
  return (
    <div className="space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={testEnabled ? "default" : "outline"} onClick={toggleTests}>
              {testEnabled ? "Disable Tests" : "Enable Tests"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Enable or disable automatic smoke tests</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={clearResults}>
              Clear Results
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Remove all current test results</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {canRunDestructiveTests && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="destructive" onClick={runErrorTest}>
                <Play className="h-4 w-4 mr-2" />
                Test Error
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Deliberately trigger an error to test error boundaries</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" onClick={runAllTests}>
              <Play className="h-4 w-4 mr-2" />
              Run All Tests
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Run all registered smoke tests</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
