
import React, { useRef } from 'react';
import * as d3 from 'd3';
import { Node, Link, SimulationConfig } from '../types';
import { useForceSimulation } from '../useForceSimulation';

interface SimulationContainerProps {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  filteredNodes: Node[];
  filteredLinks: Link[];
  startRenderTimer: () => void;
  endRenderTimer: () => void;
  setRenderedNodes: (nodes: Node[]) => void;
  setRenderedLinks: (links: Link[]) => void;
  simulationConfig?: SimulationConfig;
}

export const SimulationContainer: React.FC<SimulationContainerProps> = ({
  width,
  height,
  margin,
  filteredNodes,
  filteredLinks,
  startRenderTimer,
  endRenderTimer,
  setRenderedNodes,
  setRenderedLinks,
  simulationConfig
}) => {
  const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);
  const createSimulation = useForceSimulation(
    filteredNodes,
    filteredLinks,
    width,
    height,
    margin,
    simulationConfig
  );

  React.useEffect(() => {
    startRenderTimer();
    
    const simulation = createSimulation();
    simulationRef.current = simulation;
    
    simulation.nodes(filteredNodes);
    (simulation.force('link') as d3.ForceLink<Node, Link>).links(filteredLinks);
    
    simulation.on('tick', () => {
      setRenderedNodes([...filteredNodes]);
      setRenderedLinks([...filteredLinks]);
    });
    
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
        simulationRef.current = null;
      }
      endRenderTimer();
    };
  }, [
    width,
    height,
    margin,
    filteredNodes,
    filteredLinks,
    createSimulation,
    startRenderTimer,
    endRenderTimer,
    setRenderedNodes,
    setRenderedLinks
  ]);

  return null;
};
