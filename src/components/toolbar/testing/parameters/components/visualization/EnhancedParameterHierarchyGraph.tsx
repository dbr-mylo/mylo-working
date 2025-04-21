
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { NestedParameter } from '@/utils/navigation/parameters/types';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { analyzeParameterRelationships } from '@/utils/navigation/parameters/relationshipAnalyzer';

interface EnhancedParameterHierarchyGraphProps {
  hierarchy: Record<string, NestedParameter>;
  params: Record<string, string>;
  width?: number;
  height?: number;
}

export const EnhancedParameterHierarchyGraph: React.FC<EnhancedParameterHierarchyGraphProps> = ({ 
  hierarchy, 
  params,
  width = 800,
  height = 500
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [analysisResults, setAnalysisResults] = useState<ReturnType<typeof analyzeParameterRelationships> | null>(null);
  
  // Run relationship analysis
  useEffect(() => {
    if (Object.keys(hierarchy).length > 0) {
      const results = analyzeParameterRelationships(hierarchy);
      setAnalysisResults(results);
    }
  }, [hierarchy]);
  
  // D3 visualization
  useEffect(() => {
    if (!svgRef.current || !hierarchy || Object.keys(hierarchy).length === 0) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    // Prepare data for d3 hierarchy
    const root = prepareHierarchyData(hierarchy);
    
    // Set up SVG dimensions
    const margin = { top: 60, right: 120, bottom: 40, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create the tree layout
    const treeLayout = d3.tree()
      .size([innerHeight, innerWidth]);

    // Apply the tree layout to the hierarchy data
    const rootNode = d3.hierarchy(root);
    const treeData = treeLayout(rootNode);

    // Create the SVG container with zoom support
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
      
    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoomLevel(event.transform.k);
      });
      
    svg.call(zoom as any);
    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add links between nodes
    g.selectAll(".link")
      .data(treeData.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", (d: any) => {
        // Highlight cyclical dependencies
        if (analysisResults?.cyclicalDependencies.some(cycle => 
          cycle.includes(d.source.data.name) && cycle.includes(d.target.data.name)
        )) {
          return "#ef4444";
        }
        return "#ccc";
      })
      .attr("stroke-width", 1.5)
      .attr("d", d3.linkHorizontal()
        .x((d: any) => d.y)
        .y((d: any) => d.x)
      );

    // Add nodes
    const node = g.selectAll(".node")
      .data(treeData.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d: any) => `translate(${d.y},${d.x})`)
      .attr("data-parameter", (d: any) => d.data.name);

    // Add node circles
    node.append("circle")
      .attr("r", 6)
      .style("fill", (d: any) => getNodeColor(d.data.name, d.data.isOptional, params, analysisResults))
      .style("cursor", "pointer")
      .on("mouseover", function(event, d: any) {
        highlightConnections(d.data.name, svg);
      })
      .on("mouseout", function() {
        removeHighlights(svg);
      });

    // Add node labels
    node.append("text")
      .attr("dy", ".31em")
      .attr("x", (d: any) => d.children ? -10 : 10)
      .attr("text-anchor", (d: any) => d.children ? "end" : "start")
      .text((d: any) => `${d.data.name}${d.data.isOptional ? '?' : ''}`)
      .style("font-size", "12px")
      .style("font-family", "sans-serif");

    // Add parameter values as additional labels
    node.filter((d: any) => params[d.data.name])
      .append("text")
      .attr("dy", "1.1em")
      .attr("x", (d: any) => d.children ? -10 : 10)
      .attr("text-anchor", (d: any) => d.children ? "end" : "start")
      .text((d: any) => `= "${params[d.data.name]}"`)
      .style("font-size", "10px")
      .style("fill", "#666")
      .style("font-family", "sans-serif");

    // Add legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - margin.right - 120}, ${margin.top - 40})`);
    
    // Required parameter
    legend.append("circle").attr("r", 6).attr("cx", 0).attr("cy", 0).style("fill", "#3b82f6");
    legend.append("text").attr("x", 12).attr("y", 4).text("Required").style("font-size", "10px");
    
    // Optional parameter
    legend.append("circle").attr("r", 6).attr("cx", 100).attr("cy", 0).style("fill", "#6b7280");
    legend.append("text").attr("x", 112).attr("y", 4).text("Optional").style("font-size", "10px");
    
    // Error parameter
    legend.append("circle").attr("r", 6).attr("cx", 0).attr("cy", 20).style("fill", "#ef4444");
    legend.append("text").attr("x", 12).attr("y", 24).text("Issue").style("font-size", "10px");

  }, [hierarchy, params, width, height, analysisResults]);

  // Reset zoom to original position
  const resetZoom = () => {
    if (!svgRef.current) return;
    
    d3.select(svgRef.current)
      .transition()
      .duration(750)
      .call(
        (d3.zoom() as any).transform,
        d3.zoomIdentity.translate(0, 0).scale(1)
      );
    
    setZoomLevel(1);
  };

  // Zoom in
  const zoomIn = () => {
    if (!svgRef.current) return;
    
    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(
        (d3.zoom() as any).scaleBy,
        1.2
      );
  };

  // Zoom out
  const zoomOut = () => {
    if (!svgRef.current) return;
    
    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(
        (d3.zoom() as any).scaleBy,
        0.8
      );
  };

  // Helper function to highlight connections for a node
  const highlightConnections = (paramName: string, svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    // Dim all elements
    svg.selectAll(".link").style("opacity", 0.2);
    svg.selectAll(".node").style("opacity", 0.2);
    
    // Highlight the selected node and its connections
    svg.selectAll(`.node[data-parameter="${paramName}"]`).style("opacity", 1);
    
    // Find and highlight direct connections
    svg.selectAll(".link").each(function(d: any) {
      if (d.source.data.name === paramName || d.target.data.name === paramName) {
        d3.select(this).style("opacity", 1).style("stroke-width", 2);
        
        // Also highlight connected nodes
        svg.selectAll(`.node[data-parameter="${d.source.data.name}"]`).style("opacity", 1);
        svg.selectAll(`.node[data-parameter="${d.target.data.name}"]`).style("opacity", 1);
      }
    });
  };

  // Remove highlighting
  const removeHighlights = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    svg.selectAll(".link").style("opacity", 1).style("stroke-width", 1.5);
    svg.selectAll(".node").style("opacity", 1);
  };

  // Helper function to prepare hierarchical data for d3
  const prepareHierarchyData = (hierarchy: Record<string, NestedParameter>) => {
    // Find the root parameters (those without parents)
    const rootParams = Object.values(hierarchy).filter(param => !param.parent);
    
    // Create a root node to hold all parameters
    const root = {
      name: "root",
      isOptional: false,
      children: rootParams.map(param => buildSubtree(param.name, hierarchy))
    };
    
    return root;
  };

  // Recursively build subtree for each parameter
  const buildSubtree = (paramName: string, hierarchy: Record<string, NestedParameter>) => {
    const param = hierarchy[paramName];
    const node = {
      name: paramName,
      isOptional: param.isOptional,
      children: param.children.map(child => buildSubtree(child, hierarchy))
    };
    
    return node;
  };

  // Get color based on parameter properties
  const getNodeColor = (
    name: string, 
    isOptional: boolean, 
    params: Record<string, string>,
    analysis: ReturnType<typeof analyzeParameterRelationships> | null
  ): string => {
    if (name === "root") return "#e5e7eb"; // Gray for root
    
    // Check if parameter is part of any issues
    const isPartOfCycle = analysis?.cyclicalDependencies.some(cycle => cycle.includes(name));
    const isRedundant = analysis?.redundantParameters.some(param => param.includes(name));
    const isDeadBranch = analysis?.deadBranches.includes(name);
    
    if (isPartOfCycle || isRedundant || isDeadBranch) return "#ef4444"; // Red for issues
    if (isOptional) return "#6b7280"; // Gray for optional
    return params[name] ? "#3b82f6" : "#f59e0b"; // Blue if value exists, amber if missing
  };

  // Display summary of issues if any are found
  const renderAnalysisSummary = () => {
    if (!analysisResults) return null;
    
    const { cyclicalDependencies, redundantParameters, deadBranches } = analysisResults;
    const hasIssues = cyclicalDependencies.length + redundantParameters.length + deadBranches.length > 0;
    
    if (!hasIssues) return null;
    
    return (
      <div className="text-sm mt-4 p-3 border border-amber-200 bg-amber-50 rounded-md">
        <h4 className="font-medium mb-1">Parameter Hierarchy Issues:</h4>
        <ul className="list-disc pl-5 space-y-1">
          {cyclicalDependencies.length > 0 && (
            <li className="text-red-600">{cyclicalDependencies.length} circular dependencies detected</li>
          )}
          {redundantParameters.length > 0 && (
            <li className="text-amber-600">{redundantParameters.length} potentially redundant parameters</li>
          )}
          {deadBranches.length > 0 && (
            <li className="text-amber-600">{deadBranches.length} unused parameters detected</li>
          )}
        </ul>
        <p className="text-xs text-muted-foreground mt-2">
          Hover over nodes to see connections. Parameters with issues are highlighted in red.
        </p>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-muted-foreground">
          Zoom: {Math.round(zoomLevel * 100)}%
        </div>
        <div className="space-x-1">
          <Button variant="outline" size="sm" onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={zoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={resetZoom}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="w-full overflow-auto border rounded-md">
        <svg ref={svgRef} className="w-full h-[500px]"></svg>
      </div>
      
      {renderAnalysisSummary()}
    </div>
  );
};
