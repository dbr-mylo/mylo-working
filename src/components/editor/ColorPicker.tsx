
import React from 'react';
import { Editor } from '@tiptap/react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Paintbrush } from 'lucide-react';

const colors = [
  { name: 'Black', value: '#000000' },
  { name: 'Gray', value: '#4B5563' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Green', value: '#10B981' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#8B5CF6' },
];

interface ColorPickerProps {
  editor: Editor;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ editor }) => {
  const currentColor = editor.getAttributes('textStyle').color || '#000000';

  const handleColorChange = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="xs" className="h-7 flex gap-1 items-center">
          <Paintbrush className="h-3 w-3" />
          <div 
            className="w-3 h-3 rounded-full border border-gray-300" 
            style={{ backgroundColor: currentColor }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        <div className="grid grid-cols-7 gap-1">
          {colors.map((color) => (
            <button
              key={color.value}
              className={`w-7 h-7 rounded-full border ${currentColor === color.value ? 'ring-1 ring-blue-500' : 'border-gray-300'}`}
              style={{ backgroundColor: color.value }}
              onClick={() => handleColorChange(color.value)}
              title={color.name}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
