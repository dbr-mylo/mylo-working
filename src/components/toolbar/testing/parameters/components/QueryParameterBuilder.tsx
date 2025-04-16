
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface QueryParam {
  key: string;
  value: string;
}

interface QueryParameterBuilderProps {
  params: QueryParam[];
  onParamUpdate: (index: number, field: 'key' | 'value', value: string) => void;
  onParamRemove: (index: number) => void;
  onAddParam: () => void;
}

export const QueryParameterBuilder: React.FC<QueryParameterBuilderProps> = ({
  params,
  onParamUpdate,
  onParamRemove,
  onAddParam,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Query Parameters</label>
        <Button variant="outline" size="sm" onClick={onAddParam}>
          Add Query Parameter
        </Button>
      </div>
      
      {params.map((param, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Input
            placeholder="Parameter name"
            value={param.key}
            onChange={(e) => onParamUpdate(index, 'key', e.target.value)}
            className="w-1/3"
          />
          <Input
            placeholder="Parameter value"
            value={param.value}
            onChange={(e) => onParamUpdate(index, 'value', e.target.value)}
          />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onParamRemove(index)}
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
};
