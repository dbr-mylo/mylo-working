
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  name: string;
  level: number;
  optional: boolean;
  hasValue: boolean;
}

interface Link {
  source: string;
  target: string;
}

interface EnhancedParameterHierarchyGraphProps {
  hierarchy: Record<string, any>;
  params: Record<string, string>;
}

export const EnhancedParameterHierarchyGraph: React.FC<EnhancedParameterHierarchyGraphProps> = ({
  hierarchy,
  params
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Create graph data from hierarchy and params
  const getGraphData = () => {
    const nodes: Node[] = [];
    const links: Link[] = [];
    
    // Create nodes
    Object.entries(hierarchy).forEach(([paramName, paramDetails]: [string, any]) => {
      nodes.push({
        id: paramName,
        name: paramName,
        level: paramDetails.level || 0,
        optional: paramDetails.isOptional || false,
        hasValue: params[paramName] !== undefined && params[paramName] !== ''
      });
      
      // Create links
      if (paramDetails.children && Array.isArray(paramDetails.children)) {
        paramDetails.children.forEach((childName: string) => {
          links.push({
            source: paramName,
            target: childName
          });
        });
      }
    });
    
    return { nodes, links };
  };
  
  useEffect(() => {
    if (!svgRef.current || Object.keys(hierarchy).length === 0) return;
    
    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll('*').remove();
    
    const { nodes, links } = getGraphData();
    
    // Set up dimensions
    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    
    // Create SVG container
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Create force simulation
    const simulation = d3.forceSimulation<Node>()
      .force('link', d3.forceLink<Node, Link>().id((d) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2 - margin.left, height / 2 - margin.top))
      .force('x', d3.forceX(width / 2 - margin.left).strength(0.1))
      .force('y', d3.forceY(height / 2 - margin.top).strength(0.1));
    
    // Draw links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#ddd')
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#arrowhead)');
    
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
      .attr('fill', d => d.hasValue ? (d.optional ? '#e9d8fd' : '#c3dafe') : '#feebc8')
      .attr('stroke', d => d.hasValue ? (d.optional ? '#9f7aea' : '#63b3ed') : '#ed8936')
      .attr('stroke-width', 2);
    
    // Node labels
    node.append('text')
      .text(d => d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold');
    
    // Add level text below
    node.append('text')
      .text(d => `Level: ${d.level}`)
      .attr('text-anchor', 'middle')
      .attr('dy', '1.5em')
      .attr('font-size', '8px');
    
    // Add param values as tooltips
    node.append('title')
      .text(d => `${d.name}: ${params[d.id] || '(empty)'}
Type: ${d.optional ? 'Optional' : 'Required'}
Value present: ${d.hasValue ? 'Yes' : 'No'}`);
    
    // Update positions in the simulation
    simulation.nodes(nodes).on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);
      
      node.attr('transform', d => `translate(${d.x}, ${d.y})`);
    });
    
    // Apply links to the simulation
    (simulation.force('link') as d3.ForceLink<Node, Link>)
      .links(links);
    
  }, [hierarchy, params]);
  
  if (Object.keys(hierarchy).length === 0) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-muted-foreground">No parameter hierarchy data available</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <svg ref={svgRef} className="w-full" style={{ minHeight: '300px' }}></svg>
      
      <div className="mt-2 flex flex-wrap gap-2 justify-center">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-c3dafe mr-1"></div>
          <span className="text-xs">Required (with value)</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-e9d8fd mr-1"></div>
          <span className="text-xs">Optional (with value)</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-feebc8 mr-1"></div>
          <span className="text-xs">No value</span>
        </div>
      </div>
    </div>
  );
};
