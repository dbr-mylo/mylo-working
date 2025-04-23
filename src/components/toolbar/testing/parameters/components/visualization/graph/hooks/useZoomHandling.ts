
import { useCallback } from 'react';
import * as d3 from 'd3';

export const useZoomHandling = (svgRef: React.RefObject<SVGSVGElement>) => {
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

  return {
    handleZoomIn,
    handleZoomOut,
    handleResetPan
  };
};
