
import { useCallback } from 'react';
import { Node } from '../types';

interface UseNodeInteractionsProps {
  margin: { top: number; left: number; };
}

export const useNodeInteractions = ({ margin }: UseNodeInteractionsProps) => {
  const handleDragStart = useCallback((event: any, d: Node) => {
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
