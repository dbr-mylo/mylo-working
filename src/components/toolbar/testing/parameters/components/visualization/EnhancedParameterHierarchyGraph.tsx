
import React, { useRef, useState } from 'react';
import * as d3 from 'd3';
import { GraphLegend } from './graph/GraphLegend';
import { useGraphData } from './graph/useGraphData';
import { useForceSimulation } from './graph/useForceSimulation';
import { useRenderMetrics } from './graph/useRenderMetrics';
import { MemoizedNode } from './graph/MemoizedNode';
import { MemoizedLink } from './graph/MemoizedLink';
import { GraphControls } from './graph/GraphControls';
import { GraphFilter } from './graph/GraphFilter';
import { GraphInitializer } from './graph/components/GraphInitializer';
import { useZoomHandling } from './graph/hooks/useZoomHandling';
import { useNodeInteractions } from './graph/hooks/useNodeInteractions';
import type { GraphProps, Node, Link, SimulationConfig } from './graph/types';

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
    endRenderTimer 
  } = useRenderMetrics(filteredNodes.length, filteredLinks.length);

  // Use custom hooks
  const { handleZoomIn, handleZoomOut, handleResetPan } = useZoomHandling(svgRef);
  const { 
    handleDragStart, 
    handleDrag, 
    handleDragEnd,
    handleHighlightNode,
    handleEditNode 
  } = useNodeInteractions({ 
    simulationRef, 
    margin 
  });

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

      <GraphInitializer
        svgRef={svgRef}
        width={width}
        height={height}
        margin={margin}
        filteredNodes={filteredNodes}
        filteredLinks={filteredLinks}
        startRenderTimer={startRenderTimer}
        endRenderTimer={endRenderTimer}
        setRenderedNodes={setRenderedNodes}
        setRenderedLinks={setRenderedLinks}
        simulationRef={simulationRef}
        createSimulation={createSimulation}
      />
      
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
          Render: {metrics.renderTime.toFixed(2)}ms
        </div>
      )}
    </div>
  );
};
