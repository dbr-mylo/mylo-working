import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as d3 from 'd3';
import { GraphLegend } from './graph/GraphLegend';
import { useGraphData } from './graph/useGraphData';
import { useForceSimulation } from './graph/useForceSimulation';
import { useRenderMetrics } from './graph/useRenderMetrics';
import { MemoizedNode } from './graph/MemoizedNode';
import { MemoizedLink } from './graph/MemoizedLink';
import { GraphControls } from './graph/GraphControls';
import { GraphFilter } from './graph/GraphFilter';
import type { GraphProps, Node, Link } from './graph/types';

export const EnhancedParameterHierarchyGraph: React.FC<GraphProps> = ({
  hierarchy,
  params,
  width: propWidth = 600,
  height: propHeight = 300,
  optimizationLevel = 'medium'
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);
  
  // State for interactivity
  const [renderedNodes, setRenderedNodes] = useState<Node[]>([]);
  const [renderedLinks, setRenderedLinks] = useState<Link[]>([]);
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [showRequired, setShowRequired] = useState(true);
  const [showOptional, setShowOptional] = useState(true);
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  
  // Set up dimensions and margin
  const width = propWidth;
  const height = propHeight;
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  
  // Get graph data with memoization
  const { nodes, links } = useGraphData(hierarchy);
  
  // Filter nodes based on search and toggles
  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = (node.optional ? showOptional : showRequired);
    return matchesSearch && matchesType;
  });

  const filteredLinks = links.filter(link => {
    const sourceNode = (typeof link.source === 'string' ? link.source : link.source.id);
    const targetNode = (typeof link.target === 'string' ? link.target : link.target.id);
    return filteredNodes.some(n => n.id === sourceNode) && 
           filteredNodes.some(n => n.id === targetNode);
  });
  
  // Performance tracking
  const { 
    metrics, 
    startRenderTimer, 
    endRenderTimer,
    startSimulationTimer,
    endSimulationTimer
  } = useRenderMetrics(filteredNodes.length, filteredLinks.length);
  
  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    if (!svgRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .call(d3.zoom<SVGSVGElement, unknown>().scaleBy, 1.2);
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!svgRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .call(d3.zoom<SVGSVGElement, unknown>().scaleBy, 0.8);
  }, []);

  const handleResetPan = useCallback(() => {
    if (!svgRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .call(d3.zoom<SVGSVGElement, unknown>().transform, d3.zoomIdentity);
  }, []);

  // Node interaction handlers
  const handleHighlightNode = useCallback((nodeId: string) => {
    setHighlightedNode(nodeId);
  }, []);

  const handleEditNode = useCallback((nodeId: string) => {
    // You can implement edit functionality here
    console.log('Edit node:', nodeId);
  }, []);

  // Use existing simulation setup
  const simulationConfig: SimulationConfig = {
    linkDistance: optimizationLevel === 'high' ? 80 : 100,
    alphaDecay: optimizationLevel === 'high' ? 0.1 : undefined,
    velocityDecay: optimizationLevel === 'high' ? 0.6 : 0.4
  };
  
  const createSimulation = useForceSimulation(
    nodes, 
    links, 
    width, 
    height, 
    margin,
    simulationConfig
  );
  
  // Drag handlers with useCallback for stability
  const handleDragStart = useCallback((event: any, d: Node) => {
    if (!simulationRef.current) return;
    
    // Reheat the simulation when dragging starts
    simulationRef.current.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }, []);
  
  const handleDrag = useCallback((event: any, d: Node) => {
    if (!event || !d.fx) return;
    
    // Get mouse coordinates relative to SVG
    const svg = svgRef.current;
    if (!svg) return;
    
    const svgRect = svg.getBoundingClientRect();
    const x = event.clientX - svgRect.left - margin.left;
    const y = event.clientY - svgRect.top - margin.top;
    
    d.fx = x;
    d.fy = y;
  }, [margin]);
  
  const handleDragEnd = useCallback((event: any, d: Node) => {
    if (!simulationRef.current) return;
    
    // Cool down simulation when drag ends
    simulationRef.current.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }, []);
  
  // Initialize and update simulation when data changes
  useEffect(() => {
    if (!svgRef.current || Object.keys(hierarchy).length === 0) return;
    
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
    const linkGroup = svg.append('g').attr('class', 'links');
    const nodeGroup = svg.append('g').attr('class', 'nodes');
    
    // Start simulation timing
    startSimulationTimer();
    
    // Create simulation
    const simulation = createSimulation();
    simulationRef.current = simulation;
    
    // Apply nodes and links to simulation
    simulation.nodes(filteredNodes);
    (simulation.force('link') as d3.ForceLink<Node, Link>).links(filteredLinks);
    
    // End simulation timing
    endSimulationTimer();
    
    // Update positions on simulation tick
    simulation.on('tick', () => {
      // Update state for rendered components
      setRenderedNodes([...filteredNodes]);
      setRenderedLinks([...filteredLinks]);
    });
    
    // Cleanup when component unmounts
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [hierarchy, params, width, height, margin, createSimulation, nodes, links, startRenderTimer, endRenderTimer, startSimulationTimer, endSimulationTimer]);
  
  // Complete render timing after nodes and links are updated
  useEffect(() => {
    if (renderedNodes.length > 0) {
      endRenderTimer();
    }
  }, [renderedNodes, endRenderTimer]);
  
  // Display empty state when no hierarchy data
  if (Object.keys(hierarchy).length === 0) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-muted-foreground">No parameter hierarchy data available</p>
      </div>
    );
  }
  
  return (
    <div className="relative overflow-x-auto">
      <GraphFilter
        searchQuery={searchQuery}
        showRequired={showRequired}
        showOptional={showOptional}
        onSearchChange={setSearchQuery}
        onRequiredToggle={() => setShowRequired(!showRequired)}
        onOptionalToggle={() => setShowOptional(!showOptional)}
      />
      
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
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                onHighlight={() => handleHighlightNode(node.id)}
                onEdit={() => handleEditNode(node.id)}
              />
            ))}
          </g>
        </g>
      </svg>
      
      <GraphControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetPan={handleResetPan}
      />
      
      <GraphLegend />
      
      {optimizationLevel === 'high' && (
        <div className="absolute top-1 left-1 text-xs text-gray-500 bg-white bg-opacity-80 p-1 rounded">
          Nodes: {metrics.nodesCount} | 
          Links: {metrics.linksCount} | 
          Render: {metrics.renderTime.toFixed(2)}ms | 
          Sim: {metrics.simulationTime.toFixed(2)}ms
        </div>
      )}
    </div>
  );
};
