
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

    // Set up SVG dimensions with better responsiveness
    const containerWidth = svgRef.current.parentElement?.clientWidth || 800;
    const width = Math.min(containerWidth, 1200);
    const height = 400;
    const margin = { top: 40, right: 120, bottom: 40, left: 120 };

    // Create the SVG container with responsive sizing
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create hierarchical data structure
    const root = d3.hierarchy(prepareHierarchyData(hierarchy));

    // Create tree layout
    const treeLayout = d3.tree()
      .size([height - margin.top - margin.bottom, width - margin.right - margin.left]);

    // Apply layout
    const treeData = treeLayout(root);

    // Add links with smooth curves
    svg.selectAll(".link")
      .data(treeData.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#e2e8f0")
      .attr("stroke-width", 1.5)
      .attr("d", d3.linkHorizontal()
        .x((d: any) => d.y)
        .y((d: any) => d.x)
      );

    // Create node groups with enhanced interactivity
    const node = svg.selectAll(".node")
      .data(treeData.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d: any) => `translate(${d.y},${d.x})`)
      .attr("data-parameter", (d: any) => d.data.name);

    // Add interactive node circles
    node.append("circle")
      .attr("r", 6)
      .style("fill", (d: any) => getNodeColor(d.data.name, d.data.isOptional, params))
      .style("stroke", "#fff")
      .style("stroke-width", 2)
      .on("mouseover", function(event, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 8);
      })
      .on("mouseout", function(event, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 6);
      });

    // Add parameter labels
    node.append("text")
      .attr("dy", ".31em")
      .attr("x", (d: any) => d.children ? -10 : 10)
      .attr("text-anchor", (d: any) => d.children ? "end" : "start")
      .text((d: any) => `${d.data.name}${d.data.isOptional ? '?' : ''}`)
      .style("font-size", "12px")
      .style("font-family", "system-ui");

    // Add parameter values
    node.filter((d: any) => params[d.data.name])
      .append("text")
      .attr("dy", "1.1em")
      .attr("x", (d: any) => d.children ? -10 : 10)
      .attr("text-anchor", (d: any) => d.children ? "end" : "start")
      .text((d: any) => `= "${params[d.data.name]}"`)
      .style("font-size", "10px")
      .style("fill", "#64748b")
      .style("font-family", "system-ui");

    // Add interactive tooltips
    node.append("title")
      .text((d: any) => {
        const param = d.data;
        return `Parameter: ${param.name}
Type: ${param.isOptional ? 'Optional' : 'Required'}
Value: ${params[param.name] || '(empty)'}`;
      });

  }, [hierarchy, params]);

  // Helper function to prepare hierarchical data
  const prepareHierarchyData = (hierarchy: Record<string, NestedParameter>) => {
    const rootParams = Object.values(hierarchy).filter(param => !param.parent);
    return {
      name: "root",
      isOptional: false,
      children: rootParams.map(param => buildSubtree(param.name, hierarchy))
    };
  };

  // Helper function to build parameter subtrees
  const buildSubtree = (paramName: string, hierarchy: Record<string, NestedParameter>) => {
    const param = hierarchy[paramName];
    return {
      name: paramName,
      isOptional: param.isOptional,
      children: param.children.map(child => buildSubtree(child, hierarchy))
    };
  };

  // Get color based on parameter properties
  const getNodeColor = (name: string, isOptional: boolean, params: Record<string, string>): string => {
    if (name === "root") return "#f1f5f9";
    if (isOptional) return params[name] ? "#c7d2fe" : "#e2e8f0";
    return params[name] ? "#93c5fd" : "#fca5a5";
  };

  return (
    <div className="relative w-full overflow-hidden">
      <svg 
        ref={svgRef} 
        className="w-full h-[400px] border rounded-lg bg-white shadow-sm"
      />
      <div className="absolute top-2 right-2 flex gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#93c5fd]" />
          <span>Required (with value)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#c7d2fe]" />
          <span>Optional (with value)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#fca5a5]" />
          <span>Required (no value)</span>
        </div>
      </div>
    </div>
  );
};
