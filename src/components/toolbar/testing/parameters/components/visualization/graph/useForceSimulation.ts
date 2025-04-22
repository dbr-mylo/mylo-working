
import * as d3 from 'd3';
import { useEffect, useCallback } from 'react';
import { Node, Link } from './types';

export const useForceSimulation = (
  nodes: Node[],
  links: Link[],
  width: number,
  height: number,
  margin: { top: number; right: number; bottom: number; left: number }
) => {
  const createSimulation = useCallback(() => {
    return d3.forceSimulation<Node>()
      .force('link', d3.forceLink<Node, Link>().id((d) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2 - margin.left, height / 2 - margin.top))
      .force('x', d3.forceX(width / 2 - margin.left).strength(0.1))
      .force('y', d3.forceY(height / 2 - margin.top).strength(0.1));
  }, [width, height, margin]);

  return createSimulation;
};
