
import { Node, Link } from './types';

export const useGraphData = (hierarchy: Record<string, any>) => {
  const nodes: Node[] = [];
  const links: Link[] = [];
  
  Object.entries(hierarchy).forEach(([paramName, paramDetails]: [string, any]) => {
    nodes.push({
      id: paramName,
      name: paramName,
      level: paramDetails.level || 0,
      optional: paramDetails.isOptional || false,
      hasValue: paramDetails.value !== undefined && paramDetails.value !== ''
    });
    
    if (paramDetails.children && Array.isArray(paramDetails.children)) {
      paramDetails.children.forEach((childName: string) => {
        links.push({
          source: paramName,
          target: childName
        });
      });
    }
  });
  
  return { nodes, links };
};
