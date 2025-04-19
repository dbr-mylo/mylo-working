
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface NestedParameter {
  name: string;
  isOptional: boolean;
  parent?: string;
  children: string[];
  level: number;
}

interface ParameterHierarchyViewProps {
  hierarchy: Record<string, NestedParameter>;
  params: Record<string, string>;
}

export const ParameterHierarchyView: React.FC<ParameterHierarchyViewProps> = ({
  hierarchy,
  params
}) => {
  const rootParams = Object.values(hierarchy).filter(param => !param.parent);

  const renderParameter = (param: NestedParameter) => {
    const value = params[param.name];
    const hasChildren = param.children.length > 0;
    
    return (
      <div key={param.name} className="space-y-2">
        <div 
          className="flex items-center space-x-2" 
          style={{ marginLeft: `${param.level * 20}px` }}
        >
          {hasChildren && <ChevronRight className="h-4 w-4" />}
          <div className="flex items-center space-x-2">
            <span className="font-medium">{param.name}</span>
            {param.isOptional && (
              <Badge variant="outline" className="text-xs">
                Optional
              </Badge>
            )}
          </div>
          {value && (
            <Badge variant="secondary" className="ml-2">
              {value}
            </Badge>
          )}
        </div>
        
        {param.children.map(childName => renderParameter(hierarchy[childName]))}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="space-y-2">
          {rootParams.map(renderParameter)}
        </div>
      </CardContent>
    </Card>
  );
};
