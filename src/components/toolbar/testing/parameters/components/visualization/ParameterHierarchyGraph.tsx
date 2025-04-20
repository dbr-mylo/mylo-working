
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { NestedParameter } from '@/utils/navigation/parameters/types';

interface ParameterHierarchyGraphProps {
  hierarchy: Record<string, NestedParameter>;
  params: Record<string, string>;
}

export const ParameterHierarchyGraph: React.FC<ParameterHierarchyGraphProps> = ({ 
  hierarchy, 
  params 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !hierarchy || Object.keys(hierarchy).length === 0) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    // Prepare data for d3 hierarchy
    const root = prepareHierarchyData(hierarchy);
    
    // Set up SVG dimensions
    const width = 800;
    const height = 400;
    const margin = { top: 60, right: 120, bottom: 20, left: 120 };

    // Create the tree layout
    const treeLayout = d3.tree()
      .size([height - margin.top - margin.bottom, width - margin.right - margin.left]);

    // Apply the tree layout to the hierarchy data
    const rootNode = d3.hierarchy(root);
    const treeData = treeLayout(rootNode);

    // Create the SVG container
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add links between nodes
    svg.selectAll(".link")
      .data(treeData.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1.5)
      .attr("d", d3.linkHorizontal()
        .x((d: any) => d.y)
        .y((d: any) => d.x)
      );

    // Add nodes
    const node = svg.selectAll(".node")
      .data(treeData.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d: any) => `translate(${d.y},${d.x})`);

    // Add node circles
    node.append("circle")
      .attr("r", 6)
      .style("fill", (d: any) => getNodeColor(d.data.name, d.data.isOptional, params));

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
      .attr("transform", `translate(${width - margin.right - margin.left - 150}, -40)`);
    
    // Required parameter
    legend.append("circle").attr("r", 6).attr("cx", 0).attr("cy", 0).style("fill", "#3b82f6");
    legend.append("text").attr("x", 12).attr("y", 4).text("Required").style("font-size", "10px");
    
    // Optional parameter
    legend.append("circle").attr("r", 6).attr("cx", 100).attr("cy", 0).style("fill", "#6b7280");
    legend.append("text").attr("x", 112).attr("y", 4).text("Optional").style("font-size", "10px");

  }, [hierarchy, params]);

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
  const getNodeColor = (name: string, isOptional: boolean, params: Record<string, string>): string => {
    if (name === "root") return "#e5e7eb"; // Gray for root
    if (isOptional) return "#6b7280"; // Gray for optional
    return params[name] ? "#3b82f6" : "#ef4444"; // Blue if value exists, red if missing
  };

  return (
    <div className="w-full overflow-x-auto">
      <svg ref={svgRef} className="w-full h-[400px] border rounded"></svg>
    </div>
  );
};
