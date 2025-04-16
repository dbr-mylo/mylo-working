
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PathSegment {
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
  onBuildPath,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Path Segment Builder</h3>
      <p className="text-xs text-muted-foreground">
        Build complex paths by adding static segments and parameter placeholders
      </p>
      
      {segments.map((segment, index) => (
        <div key={index} className="flex gap-2 items-center">
          <select 
            className="p-2 border rounded-md"
            value={segment.type}
            onChange={(e) => onSegmentUpdate(index, 'type', e.target.value)}
          >
            <option value="static">Static</option>
            <option value="param">Parameter</option>
          </select>
          
          {segment.type === 'param' && (
            <Input
              placeholder="Parameter name"
              value={segment.name}
              onChange={(e) => onSegmentUpdate(index, 'name', e.target.value)}
              className="w-1/3"
            />
          )}
          
          <Input
            placeholder={segment.type === 'static' ? 'Segment value' : 'Parameter value'}
            value={segment.value}
            onChange={(e) => onSegmentUpdate(index, 'value', e.target.value)}
          />
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onSegmentRemove(index)}
          >
            Remove
          </Button>
        </div>
      ))}
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => onAddSegment('static')}>
          Add Static Segment
        </Button>
        <Button variant="outline" onClick={() => onAddSegment('param')}>
          Add Parameter
        </Button>
        <Button onClick={onBuildPath}>
          Build Path
        </Button>
      </div>
    </div>
  );
};
