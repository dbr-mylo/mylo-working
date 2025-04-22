
import React, { memo } from 'react';
import { Link, Node } from './types';

interface LinkProps {
  link: Link;
}

export const MemoizedLink = memo(({ link }: LinkProps) => {
  const source = link.source as Node;
  const target = link.target as Node;
  
  // Ensure we have valid coordinates before rendering
  if (!source?.x || !source?.y || !target?.x || !target?.y) {
    return null;
  }
  
  return (
    <line
      className="parameter-link"
      x1={source.x}
      y1={source.y}
      x2={target.x}
      y2={target.y}
      stroke="#ddd"
      strokeWidth={1.5}
      markerEnd="url(#arrowhead)"
    />
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to optimize re-renders
  const prevSource = prevProps.link.source as Node;
  const prevTarget = prevProps.link.target as Node;
  const nextSource = nextProps.link.source as Node;
  const nextTarget = nextProps.link.target as Node;
  
  // Only re-render if positions have changed
  return (
    prevSource.x === nextSource.x &&
    prevSource.y === nextSource.y &&
    prevTarget.x === nextTarget.x &&
    prevTarget.y === nextTarget.y
  );
});
