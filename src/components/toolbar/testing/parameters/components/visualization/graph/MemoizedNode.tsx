
import React, { memo } from 'react';
import { Node } from './types';

interface NodeProps {
  node: Node;
  params: Record<string, string>;
  onDragStart: (event: any, d: Node) => void;
  onDrag: (event: any, d: Node) => void;
  onDragEnd: (event: any, d: Node) => void;
}

// Using memo to prevent unnecessary re-renders when other nodes change
export const MemoizedNode = memo(({
  node,
  params,
  onDragStart,
  onDrag,
  onDragEnd
}: NodeProps) => {
  const nodeLabel = node.name.length > 12 ? `${node.name.substring(0, 10)}...` : node.name;
  const hasValue = params[node.id] && params[node.id].length > 0;
  const nodeValue = params[node.id] || '(empty)';
  const displayValue = nodeValue.length > 15 ? `${nodeValue.substring(0, 13)}...` : nodeValue;
  
  return (
    <g
      className="parameter-node"
      data-testid={`node-${node.id}`}
      onMouseDown={(e) => onDragStart(e, node)}
      onMouseMove={(e) => onDrag(e, node)}
      onMouseUp={(e) => onDragEnd(e, node)}
      onMouseLeave={(e) => onDragEnd(e, node)}
    >
      <circle
        r={25}
        fill={node.hasValue ? (node.optional ? '#c7d2fe' : '#93c5fd') : '#fca5a5'}
        stroke={node.hasValue ? (node.optional ? '#9f7aea' : '#63b3ed') : '#ed8936'}
        strokeWidth={2}
      />
      
      <text
        textAnchor="middle"
        dy=".35em"
        fontSize="10px"
        fontWeight="bold"
      >
        {nodeLabel}
      </text>
      
      <text
        textAnchor="middle"
        dy="1.5em"
        fontSize="8px"
      >
        {`Level: ${node.level}`}
      </text>
      
      <title>
        {`${node.name}: ${params[node.id] || '(empty)'}
Type: ${node.optional ? 'Optional' : 'Required'}
Value present: ${node.hasValue ? 'Yes' : 'No'}`}
      </title>
    </g>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to determine if re-render is needed
  const prevNode = prevProps.node;
  const nextNode = nextProps.node;
  const prevParam = prevProps.params[prevNode.id];
  const nextParam = nextProps.params[nextNode.id];
  
  // Only re-render if position or data has changed
  return (
    prevNode.x === nextNode.x &&
    prevNode.y === nextNode.y &&
    prevNode.hasValue === nextNode.hasValue &&
    prevNode.optional === nextNode.optional &&
    prevParam === nextParam
  );
});
