
import { useCallback } from 'react';
import * as d3 from 'd3';
import { Node } from '../types';

interface UseNodeInteractionsProps {
  simulationRef: React.MutableRefObject<d3.Simulation<Node, any> | null>;
  margin: { top: number; left: number; };
}

export const useNodeInteractions = ({ simulationRef, margin }: UseNodeInteractionsProps) => {
  const handleDragStart = useCallback((event: any, d: Node) => {
    if (!simulationRef.current) return;
    simulationRef.current.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }, []);
  
  const handleDrag = useCallback((event: any, d: Node) => {
    if (!event || !d.fx) return;
    
    const svg = event.target.closest('svg');
    if (!svg) return;
    
    const svgRect = svg.getBoundingClientRect();
    const x = event.clientX - svgRect.left - margin.left;
    const y = event.clientY - svgRect.top - margin.top;
    
    d.fx = x;
    d.fy = y;
  }, [margin]);
  
  const handleDragEnd = useCallback((event: any, d: Node) => {
    if (!simulationRef.current) return;
    simulationRef.current.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }, []);

  const handleHighlightNode = useCallback((nodeId: string) => {
    console.log('Highlight node:', nodeId);
  }, []);

  const handleEditNode = useCallback((nodeId: string) => {
    console.log('Edit node:', nodeId);
  }, []);

  return {
    handleDragStart,
    handleDrag,
    handleDragEnd,
    handleHighlightNode,
    handleEditNode
  };
};
