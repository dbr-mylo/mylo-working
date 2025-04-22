
import { useMemo } from 'react';
import { Node, Link } from './types';

export const useGraphData = (hierarchy: Record<string, any>) => {
  // Use memoization to prevent unnecessary recalculations when hierarchy doesn't change
  return useMemo(() => {
    if (!hierarchy || Object.keys(hierarchy).length === 0) {
      return { nodes: [], links: [] };
    }
    
    console.time('graphDataCalculation');
    
    const nodes: Node[] = [];
    const links: Link[] = [];
    const nodeMap = new Map<string, Node>();
    
    // First pass: create all nodes to ensure they exist before creating links
    Object.entries(hierarchy).forEach(([paramName, paramDetails]: [string, any]) => {
      const node: Node = {
        id: paramName,
        name: paramName,
        level: paramDetails.level || 0,
        optional: paramDetails.isOptional || false,
        hasValue: paramDetails.value !== undefined && paramDetails.value !== ''
      };
      
      nodes.push(node);
      nodeMap.set(paramName, node);
    });
    
    // Second pass: create all links now that all nodes exist
    Object.entries(hierarchy).forEach(([paramName, paramDetails]: [string, any]) => {
      if (paramDetails.children && Array.isArray(paramDetails.children)) {
        paramDetails.children.forEach((childName: string) => {
          // Only create links where both source and target nodes exist
          if (nodeMap.has(paramName) && nodeMap.has(childName)) {
            links.push({
              source: paramName,
              target: childName
            });
          }
        });
      }
    });
    
    console.timeEnd('graphDataCalculation');
    console.log(`Generated graph data: ${nodes.length} nodes, ${links.length} links`);
    
    return { nodes, links };
  }, [hierarchy]); // Only recompute when hierarchy changes
};
