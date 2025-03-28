
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface TestNotesProps {
  notes: string;
  onChange: (notes: string) => void;
}

export const TestNotes: React.FC<TestNotesProps> = ({ notes, onChange }) => {
  return (
    <Textarea 
      placeholder="Add test notes here..."
      value={notes}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-[80px] mb-2"
    />
  );
};
