
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface TestNotesProps {
  notes: string;
  onChange: (notes: string) => void;
  maxLength?: number;
}

export const TestNotes: React.FC<TestNotesProps> = ({ 
  notes, 
  onChange, 
  maxLength = 500
}) => {
  const charactersLeft = maxLength - notes.length;
  const isNearLimit = charactersLeft < 50;
  
  return (
    <div className="space-y-1">
      <Textarea 
        placeholder="Add test notes here..."
        value={notes}
        onChange={(e) => {
          const value = e.target.value;
          if (maxLength && value.length <= maxLength) {
            onChange(value);
          }
        }}
        className="min-h-[80px] mb-1"
      />
      <div className="flex justify-end text-xs">
        <span className={isNearLimit ? "text-orange-500" : "text-muted-foreground"}>
          {charactersLeft} characters left
        </span>
      </div>
    </div>
  );
};
