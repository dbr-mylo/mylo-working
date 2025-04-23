
import React, { useRef } from 'react';
import * as d3 from 'd3';
import { GraphContainer } from './graph/components/GraphContainer';
import { GraphLegend } from './graph/GraphLegend';
import { useGraphData } from './graph/useGraphData';
import { useForceSimulation } from './graph/useForceSimulation';
import { useRenderMetrics } from './graph/useRenderMetrics';
import { GraphControls } from './graph/GraphControls';
import { GraphFilter } from './graph/GraphFilter';
import { GraphInitializer } from './graph/components/GraphInitializer';
import { useZoomHandling } from './graph/hooks/useZoomHandling';
import { useNodeInteractions } from './graph/hooks/useNodeInteractions';
import { useGraphState } from './graph/hooks/useGraphState';
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
  
  // Set up dimensions and margin
  const width = propWidth;
  const height = propHeight;
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };

  // Custom hooks
  const {
    renderedNodes,
    setRenderedNodes,
    renderedLinks,
    setRenderedLinks,
    searchQuery,
    setSearchQuery,
    showRequired,
    setShowRequired,
    showOptional,
    setShowOptional,
    filterNodes,
    filterLinks
  } = useGraphState();

  const { nodes, links } = useGraphData(hierarchy);
  const filteredNodes = filterNodes(nodes);
  const filteredLinks = filterLinks(links, filteredNodes);

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

  const { 
    metrics, 
    startRenderTimer, 
    endRenderTimer 
  } = useRenderMetrics(filteredNodes.length, filteredLinks.length);

  // Simulation configuration
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
      
      <GraphContainer
        svgRef={svgRef}
        margin={margin}
        renderedNodes={renderedNodes}
        renderedLinks={renderedLinks}
        params={params}
        onNodeDragStart={handleDragStart}
        onNodeDrag={handleDrag}
        onNodeDragEnd={handleDragEnd}
        onNodeHighlight={handleHighlightNode}
        onNodeEdit={handleEditNode}
      />

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
