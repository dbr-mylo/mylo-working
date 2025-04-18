
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

export interface PathSegment {
  type: 'static' | 'param';
  name: string;  // For params, the parameter name; for static, optional label
  value: string; // For params, the value; for static, the path part
}

interface PathSegmentBuilderProps {
  segments: PathSegment[];
  onSegmentUpdate: (index: number, field: string, value: string) => void;
  onSegmentRemove: (index: number) => void;
  onAddSegment: (type: 'static' | 'param') => void;
  onBuildPath: () => void;
}

export const PathSegmentBuilder: React.FC<PathSegmentBuilderProps> = ({
  segments,
  onSegmentUpdate,
  onSegmentRemove,
  onAddSegment,
  onBuildPath
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-medium">Path Builder</h3>
        <div className="flex-1 h-px bg-border"></div>
        <Button 
          onClick={() => onBuildPath()} 
          variant="secondary"
        >
          Build Path
        </Button>
      </div>

      {segments.map((segment, index) => (
        <div key={index} className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-2">
            <Select 
              value={segment.type} 
              onValueChange={(value) => onSegmentUpdate(index, 'type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="static">Static</SelectItem>
                <SelectItem value="param">Parameter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="col-span-4">
            {segment.type === 'param' ? (
              <Input
                placeholder="Parameter Name"
                value={segment.name}
                onChange={(e) => onSegmentUpdate(index, 'name', e.target.value)}
              />
            ) : (
              <Input
                placeholder="Path Segment"
                value={segment.value}
                onChange={(e) => onSegmentUpdate(index, 'value', e.target.value)}
              />
            )}
          </div>
          
          {segment.type === 'param' && (
            <div className="col-span-4">
              <Input
                placeholder="Parameter Value"
                value={segment.value}
                onChange={(e) => onSegmentUpdate(index, 'value', e.target.value)}
              />
            </div>
          )}
          
          <div className={`${segment.type === 'param' ? 'col-span-2' : 'col-span-6'} flex justify-end`}>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onSegmentRemove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddSegment('static')}
          className="flex items-center"
        >
          <Plus className="mr-1 h-4 w-4" /> Static
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddSegment('param')}
          className="flex items-center"
        >
          <Plus className="mr-1 h-4 w-4" /> Parameter
        </Button>
      </div>
    </div>
  );
};
