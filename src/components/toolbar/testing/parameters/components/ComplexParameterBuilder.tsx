
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ComplexParameterType } from '../utils/complexParameterUtils';

export interface ComplexParam {
  key: string;
  type: ComplexParameterType;
  value: string;
}

interface ComplexParameterBuilderProps {
  params: ComplexParam[];
  onParamUpdate: (index: number, field: keyof ComplexParam, value: any) => void;
  onParamRemove: (index: number) => void;
  onAddParam: () => void;
}

export const ComplexParameterBuilder: React.FC<ComplexParameterBuilderProps> = ({
  params,
  onParamUpdate,
  onParamRemove,
  onAddParam,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Complex Parameters</label>
        <Button variant="outline" size="sm" onClick={onAddParam}>
          Add Complex Parameter
        </Button>
      </div>
      
      {params.map((param, index) => (
        <div key={index} className="flex gap-2 items-center border p-2 rounded-md bg-muted/20">
          <Input
            placeholder="Parameter name"
            value={param.key}
            onChange={(e) => onParamUpdate(index, 'key', e.target.value)}
            className="w-1/4"
          />
          
          <Select 
            value={param.type} 
            onValueChange={(value) => onParamUpdate(index, 'type', value as ComplexParameterType)}
          >
            <SelectTrigger className="w-1/4">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="string">String</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="array">Array</SelectItem>
              <SelectItem value="object">Object</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            placeholder="Parameter value"
            value={param.value}
            onChange={(e) => onParamUpdate(index, 'value', e.target.value)}
            className="flex-1"
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
      
      {params.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <p>For arrays use JSON format, e.g.: [1, 2, 3] or ["a", "b", "c"]</p>
          <p>For objects use JSON format, e.g.: &#123;"key": "value"&#125;</p>
        </div>
      )}
    </div>
  );
};
