
import React from 'react';
import { Node, Link } from '../types';
import { MemoizedNode } from '../MemoizedNode';
import { MemoizedLink } from '../MemoizedLink';

interface GraphContainerProps {
  svgRef: React.RefObject<SVGSVGElement>;
  margin: { top: number; left: number; };
  renderedNodes: Node[];
  renderedLinks: Link[];
  params: Record<string, string>;
  onNodeDragStart: (event: any, d: Node) => void;
  onNodeDrag: (event: any, d: Node) => void;
  onNodeDragEnd: (event: any, d: Node) => void;
  onNodeHighlight: (nodeId: string) => void;
  onNodeEdit: (nodeId: string) => void;
}

export const GraphContainer: React.FC<GraphContainerProps> = ({
  svgRef,
  margin,
  renderedNodes,
  renderedLinks,
  params,
  onNodeDragStart,
  onNodeDrag,
  onNodeDragEnd,
  onNodeHighlight,
  onNodeEdit
}) => {
  return (
    <svg 
      ref={svgRef} 
      className="w-full" 
      style={{ minHeight: '300px' }}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <g className="links">
          {renderedLinks.map((link, i) => (
            <MemoizedLink key={`link-${i}`} link={link} />
          ))}
        </g>
        <g className="nodes">
          {renderedNodes.map((node) => (
            <MemoizedNode 
              key={node.id} 
              node={node}
              params={params}
              onDragStart={onNodeDragStart}
              onDrag={onNodeDrag}
              onDragEnd={onNodeDragEnd}
              onHighlight={() => onNodeHighlight(node.id)}
              onEdit={() => onNodeEdit(node.id)}
            />
          ))}
        </g>
      </g>
    </svg>
  );
};
