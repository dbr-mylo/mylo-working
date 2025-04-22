
import * as d3 from 'd3';
import { useCallback, useMemo } from 'react';
import { Node, Link, SimulationConfig } from './types';

export const useForceSimulation = (
  nodes: Node[],
  links: Link[],
  width: number,
  height: number,
  margin: { top: number; right: number; bottom: number; left: number },
  config: SimulationConfig = {}
) => {
  // Use adaptive strength based on node count for better performance with different sized graphs
  const getAdaptiveStrength = useMemo(() => {
    const nodeCount = nodes.length;
    // Scale charge strength based on node count
    const baseCharge = -300;
    const chargeScale = Math.min(1, 100 / Math.max(nodeCount, 1));
    return baseCharge * chargeScale;
  }, [nodes.length]);
  
  const getAdaptiveDecay = useMemo(() => {
    const nodeCount = nodes.length;
    // Faster decay for larger graphs to settle quicker
    return nodeCount > 50 ? 0.05 : 0.02;
  }, [nodes.length]);
  
  // Create simulation with dynamic configurations based on graph size
  const createSimulation = useCallback(() => {
    console.time('simulationSetup');
    
    const linkDistance = config.linkDistance || 100;
    const chargeStrength = config.chargeStrength || getAdaptiveStrength;
    const alphaDecay = config.alphaDecay || getAdaptiveDecay;
    const velocityDecay = config.velocityDecay || 0.4;
    
    const centerX = width / 2 - margin.left;
    const centerY = height / 2 - margin.top;
    
    const simulation = d3.forceSimulation<Node>()
      .force('link', d3.forceLink<Node, Link>().id((d) => d.id).distance(linkDistance))
      .force('charge', d3.forceManyBody().strength(chargeStrength))
      .force('center', d3.forceCenter(centerX, centerY))
      .force('x', d3.forceX(centerX).strength(0.1))
      .force('y', d3.forceY(centerY).strength(0.1))
      .alphaDecay(alphaDecay)
      .velocityDecay(velocityDecay);
      
    // For large graphs, reduce the target alpha to settle faster
    if (nodes.length > 100) {
      simulation.alphaTarget(0.1);
    }
    
    console.timeEnd('simulationSetup');
    return simulation;
  }, [width, height, margin, config, getAdaptiveStrength, getAdaptiveDecay, nodes.length]);

  return createSimulation;
};
