
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { GraphLegend } from './graph/GraphLegend';
import { useGraphData } from './graph/useGraphData';
import { useForceSimulation } from './graph/useForceSimulation';
import type { GraphProps } from './graph/types';

export const EnhancedParameterHierarchyGraph: React.FC<GraphProps> = ({
  hierarchy,
  params
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Set up dimensions
  const width = 600;
  const height = 300;
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  
  const { nodes, links } = useGraphData(hierarchy);
  const createSimulation = useForceSimulation(nodes, links, width, height, margin);
  
  useEffect(() => {
    if (!svgRef.current || Object.keys(hierarchy).length === 0) return;
    
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
    
    // Draw links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#ddd')
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#arrowhead)');
    
    // Draw nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );
    
    // Node circles
    node.append('circle')
      .attr('r', 25)
      .attr('fill', d => d.hasValue ? (d.optional ? '#c7d2fe' : '#93c5fd') : '#fca5a5')
      .attr('stroke', d => d.hasValue ? (d.optional ? '#9f7aea' : '#63b3ed') : '#ed8936')
      .attr('stroke-width', 2);
    
    // Node labels
    node.append('text')
      .text(d => d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold');
    
    // Level text
    node.append('text')
      .text(d => `Level: ${d.level}`)
      .attr('text-anchor', 'middle')
      .attr('dy', '1.5em')
      .attr('font-size', '8px');
    
    // Tooltips
    node.append('title')
      .text(d => `${d.name}: ${params[d.id] || '(empty)'}
Type: ${d.optional ? 'Optional' : 'Required'}
Value present: ${d.hasValue ? 'Yes' : 'No'}`);
    
    // Create simulation
    const simulation = createSimulation();
    
    // Update positions
    simulation.nodes(nodes).on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);
      
      node.attr('transform', d => `translate(${d.x}, ${d.y})`);
    });
    
    // Apply links to simulation
    (simulation.force('link') as d3.ForceLink<Node, Link>)
      .links(links);
    
  }, [hierarchy, params, createSimulation]);
  
  if (Object.keys(hierarchy).length === 0) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-muted-foreground">No parameter hierarchy data available</p>
      </div>
    );
  }
  
  return (
    <div className="relative overflow-x-auto">
      <svg 
        ref={svgRef} 
        className="w-full" 
        style={{ minHeight: '300px' }}
      />
      <GraphLegend />
    </div>
  );
};
