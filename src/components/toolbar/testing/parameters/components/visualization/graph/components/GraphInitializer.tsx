
import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { Node, Link } from '../types';

interface GraphInitializerProps {
  svgRef: React.RefObject<SVGSVGElement>;
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number; };
  filteredNodes: Node[];
  filteredLinks: Link[];
  startRenderTimer: () => void;
  endRenderTimer: () => void;
  setRenderedNodes: (nodes: Node[]) => void;
  setRenderedLinks: (links: Link[]) => void;
  simulationRef: React.MutableRefObject<d3.Simulation<Node, Link> | null>;
  createSimulation: () => d3.Simulation<Node, Link>;
}

export const GraphInitializer: React.FC<GraphInitializerProps> = ({
  svgRef,
  width,
  height,
  margin,
  filteredNodes,
  filteredLinks,
  startRenderTimer,
  endRenderTimer,
  setRenderedNodes,
  setRenderedLinks,
  simulationRef,
  createSimulation
}) => {
  useEffect(() => {
    if (!svgRef.current) return;
    
    startRenderTimer();
    
    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Create SVG container
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Create arrowhead marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#999');
    
    // Create containers for links and nodes
    svg.append('g').attr('class', 'links');
    svg.append('g').attr('class', 'nodes');
    
    // Create simulation
    const simulation = createSimulation();
    simulationRef.current = simulation;
    
    // Apply nodes and links to simulation
    simulation.nodes(filteredNodes);
    (simulation.force('link') as d3.ForceLink<Node, Link>).links(filteredLinks);
    
    // Update positions on simulation tick
    simulation.on('tick', () => {
      setRenderedNodes([...filteredNodes]);
      setRenderedLinks([...filteredLinks]);
    });
    
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [
    width,
    height,
    margin,
    filteredNodes,
    filteredLinks,
    createSimulation,
    startRenderTimer,
    setRenderedNodes,
    setRenderedLinks,
    simulationRef,
    svgRef
  ]);

  return null;
};
