
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NestedParameter } from '@/utils/navigation/parameters/types';

interface ParameterHierarchyViewProps {
  hierarchy: Record<string, NestedParameter>;
  params: Record<string, string>;
}

export const ParameterHierarchyView: React.FC<ParameterHierarchyViewProps> = ({
  hierarchy,
  params
}) => {
  // Sort parameters by level
  const sortedParams = Object.values(hierarchy).sort((a, b) => a.level - b.level);
  
  // Group by levels
  const levelGroups: Record<number, NestedParameter[]> = {};
  sortedParams.forEach(param => {
    if (!levelGroups[param.level]) {
      levelGroups[param.level] = [];
    }
    levelGroups[param.level].push(param);
  });

  const levels = Object.keys(levelGroups).map(Number).sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Parameter Hierarchy</h3>
        <Badge variant="outline">{Object.keys(hierarchy).length} parameters</Badge>
      </div>
      
      {Object.keys(hierarchy).length > 0 ? (
        <div className="space-y-4">
          {levels.map(level => (
            <div key={level} className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">
                Level {level} {level === 0 ? '(Root)' : '(Nested)'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {levelGroups[level].map(param => (
                  <Card key={param.name} className={`border ${param.isOptional ? 'border-gray-200' : 'border-blue-200'}`}>
                    <CardContent className="p-3">
                      <div className="flex items-center mb-1">
                        <span className="font-medium">{param.name}</span>
                        {param.isOptional && (
                          <Badge variant="outline" className="ml-2 text-xs">Optional</Badge>
                        )}
                      </div>
                      
                      {param.parent && (
                        <div className="text-xs text-muted-foreground">
                          Parent: {param.parent}
                        </div>
                      )}
                      
                      {param.children.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Children: {param.children.join(', ')}
                        </div>
                      )}
                      
                      <div className="mt-1 flex items-center">
                        <span className="text-xs mr-1">Value:</span>
                        <Badge variant="secondary">
                          {params[param.name] || '(empty)'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 text-muted-foreground">
          No parameter hierarchy available
        </div>
      )}
      
      {/* Relationship map view */}
      <div className="mt-6">
        <h4 className="text-sm font-medium mb-3">Relationship Map</h4>
        <div className="border rounded-md p-4">
          <div className="flex flex-col items-start space-y-3">
            {levels.map(level => (
              <div key={level} className="flex items-center w-full">
                <div className="w-24 text-xs font-medium text-muted-foreground">
                  Level {level}:
                </div>
                <div className="flex-1 flex flex-wrap gap-2">
                  {levelGroups[level].map(param => (
                    <div 
                      key={param.name}
                      className={`px-2 py-1 text-xs rounded ${
                        param.isOptional ? 
                          'bg-gray-100 text-gray-800' : 
                          'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {param.name}
                      {params[param.name] ? ` = ${params[param.name]}` : ''}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
