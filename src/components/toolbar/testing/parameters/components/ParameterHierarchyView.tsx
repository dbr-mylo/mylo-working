
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronDown, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const [expandedParams, setExpandedParams] = useState<Set<string>>(new Set(Object.keys(hierarchy)));

  const toggleExpand = (paramName: string) => {
    setExpandedParams(prev => {
      const newSet = new Set(prev);
      if (newSet.has(paramName)) {
        newSet.delete(paramName);
      } else {
        newSet.add(paramName);
      }
      return newSet;
    });
  };

  const getParentChain = (param: NestedParameter): string[] => {
    const chain: string[] = [];
    let current = param;
    
    while (current.parent) {
      chain.unshift(current.parent);
      current = hierarchy[current.parent];
    }
    
    return chain;
  };

  const renderParameter = (param: NestedParameter) => {
    const value = params[param.name];
    const hasChildren = param.children.length > 0;
    const isExpanded = expandedParams.has(param.name);
    const parentChain = getParentChain(param);
    const missingParent = param.parent && !params[param.parent];
    
    return (
      <div key={param.name} className="space-y-1">
        <div 
          className={cn(
            "flex items-center space-x-2 py-1 px-1 rounded-md transition-colors",
            hasChildren && "cursor-pointer hover:bg-accent/50"
          )}
          style={{ marginLeft: `${param.level * 20}px` }}
          onClick={hasChildren ? () => toggleExpand(param.name) : undefined}
        >
          {hasChildren && (
            isExpanded 
              ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> 
              : <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <div className="flex items-center space-x-2">
            <span className="font-medium">{param.name}</span>
            {param.isOptional ? (
              <Badge variant="outline" className="text-xs">
                Optional
              </Badge>
            ) : (
              <Badge variant="default" className="text-xs bg-primary/80">
                Required
              </Badge>
            )}
          </div>
          
          {value ? (
            <Badge variant="secondary" className="ml-2">
              {value}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              empty
            </Badge>
          )}
          
          {missingParent && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle className="h-4 w-4 text-destructive" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Missing required parent parameter: {param.parent}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        {parentChain.length > 0 && (
          <div 
            className="flex items-center text-xs text-muted-foreground"
            style={{ marginLeft: `${param.level * 20 + 12}px` }}
          >
            <span>Depends on: {parentChain.join(' → ')}</span>
          </div>
        )}
        
        {isExpanded && param.children.map(childName => renderParameter(hierarchy[childName]))}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="pt-4 space-y-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Parameter Hierarchy</h3>
          <div className="flex space-x-2">
            <button
              className="text-xs text-primary"
              onClick={() => setExpandedParams(new Set(Object.keys(hierarchy)))}
            >
              Expand All
            </button>
            <span className="text-muted-foreground">|</span>
            <button
              className="text-xs text-primary"
              onClick={() => setExpandedParams(new Set())}
            >
              Collapse All
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {rootParams.length > 0 ? (
            rootParams.map(renderParameter)
          ) : (
            <div className="text-center text-muted-foreground py-4">
              No parameters detected in this route pattern
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
