
import React from 'react';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { Search } from 'lucide-react';

interface GraphFilterProps {
  searchQuery: string;
  showRequired: boolean;
  showOptional: boolean;
  onSearchChange: (value: string) => void;
  onRequiredToggle: () => void;
  onOptionalToggle: () => void;
}

export const GraphFilter: React.FC<GraphFilterProps> = ({
  searchQuery,
  showRequired,
  showOptional,
  onSearchChange,
  onRequiredToggle,
  onOptionalToggle
}) => {
  return (
    <div className="flex gap-4 items-center mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search parameters..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex gap-2">
        <Toggle
          pressed={showRequired}
          onPressedChange={onRequiredToggle}
          aria-label="Show Required Parameters"
        >
          Required
        </Toggle>
        <Toggle
          pressed={showOptional}
          onPressedChange={onOptionalToggle}
          aria-label="Show Optional Parameters"
        >
          Optional
        </Toggle>
      </div>
    </div>
  );
};
