
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RefreshCw } from 'lucide-react';

interface ParameterTesterFormProps {
  pattern: string;
  actualPath: string;
  showAdvanced: boolean;
  onPatternChange: (pattern: string) => void;
  onPathChange: (path: string) => void;
  onAdvancedChange: (show: boolean) => void;
  onRunTest: () => void;
  onClearResults: () => void;
}

export const ParameterTesterForm: React.FC<ParameterTesterFormProps> = ({
  pattern,
  actualPath,
  showAdvanced,
  onPatternChange,
  onPathChange,
  onAdvancedChange,
  onRunTest,
  onClearResults
}) => {
  return (
    <div className="grid gap-4">
      <div>
        <Label className="text-sm font-medium">Route Pattern</Label>
        <Input 
          value={pattern}
          onChange={e => onPatternChange(e.target.value)}
          placeholder="e.g., /user/:id?/profile/:section?"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Use ? to mark optional parameters (e.g., :id?)
        </p>
      </div>
      
      <div>
        <Label className="text-sm font-medium">Actual Path</Label>
        <Input 
          value={actualPath}
          onChange={e => onPathChange(e.target.value)}
          placeholder="e.g., /user/123/profile"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="advanced-mode"
          checked={showAdvanced}
          onCheckedChange={onAdvancedChange}
        />
        <Label htmlFor="advanced-mode">Show Advanced Options</Label>
      </div>
      
      {showAdvanced && (
        <div className="p-4 border rounded-md">
          <h3 className="text-sm font-medium mb-2">Parameter Configurations</h3>
          <div className="text-sm text-muted-foreground mb-4">
            Advanced parameter configurations will be added here in future updates.
          </div>
        </div>
      )}
      
      <div className="flex space-x-2">
        <Button onClick={onRunTest} className="flex items-center">
          <RefreshCw className="mr-2 h-4 w-4" />
          Run Test
        </Button>
        <Button variant="outline" onClick={onClearResults}>
          Clear Results
        </Button>
      </div>
    </div>
  );
};
