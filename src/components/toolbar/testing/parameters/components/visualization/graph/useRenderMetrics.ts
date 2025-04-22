
import { useState, useEffect, useRef } from 'react';
import { PerformanceMetrics } from './types';

export const useRenderMetrics = (nodesCount: number, linksCount: number) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    nodesCount,
    linksCount,
    renderTime: 0,
    simulationTime: 0,
    lastUpdated: Date.now()
  });
  
  const renderStartTime = useRef<number>(0);
  const simulationStartTime = useRef<number>(0);
  
  // Start render timing
  const startRenderTimer = () => {
    renderStartTime.current = performance.now();
  };
  
  // End render timing and update metrics
  const endRenderTimer = () => {
    if (renderStartTime.current > 0) {
      const renderTime = performance.now() - renderStartTime.current;
      setMetrics(prev => ({
        ...prev,
        renderTime,
        lastUpdated: Date.now()
      }));
      renderStartTime.current = 0;
    }
  };
  
  // Start simulation timing
  const startSimulationTimer = () => {
    simulationStartTime.current = performance.now();
  };
  
  // End simulation timing and update metrics
  const endSimulationTimer = () => {
    if (simulationStartTime.current > 0) {
      const simulationTime = performance.now() - simulationStartTime.current;
      setMetrics(prev => ({
        ...prev,
        simulationTime,
        lastUpdated: Date.now()
      }));
      simulationStartTime.current = 0;
    }
  };
  
  // Update metrics when node/link counts change
  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      nodesCount,
      linksCount,
      lastUpdated: Date.now()
    }));
  }, [nodesCount, linksCount]);
  
  return { metrics, startRenderTimer, endRenderTimer, startSimulationTimer, endSimulationTimer };
};
