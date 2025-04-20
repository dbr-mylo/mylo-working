
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';

export interface PathSegment {
  type: 'static' | 'param';
  name: string;
  value: string;
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
      <div className="text-sm font-medium">Build URL Pattern and Path</div>
      
      {segments.map((segment, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-24">
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
          
          {segment.type === 'param' && (
            <Input
              placeholder="Parameter name"
              value={segment.name}
              onChange={(e) => onSegmentUpdate(index, 'name', e.target.value)}
              className="w-1/3"
            />
          )}
          
          <Input
            placeholder={segment.type === 'static' ? 'Segment text' : 'Parameter value'}
            value={segment.value}
            onChange={(e) => onSegmentUpdate(index, 'value', e.target.value)}
            className="flex-1"
          />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSegmentRemove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-1/2"
          onClick={() => onAddSegment('static')}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Static
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="w-1/2"
          onClick={() => onAddSegment('param')}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Parameter
        </Button>
      </div>
      
      <Button
        className="w-full"
        onClick={onBuildPath}
      >
        Build Path
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Pattern Preview</div>
          <div className="p-2 border rounded bg-muted text-sm font-mono">
            {segments.map(seg => 
              seg.type === 'static' ? `/${seg.value}` : `/:${seg.name}`
            ).join('')}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Path Preview</div>
          <div className="p-2 border rounded bg-muted text-sm font-mono">
            {segments.map(seg => 
              `/${seg.value}`
            ).join('')}
          </div>
        </div>
      </div>
    </div>
  );
};
