
export interface Node {
  id: string;
  name: string;
  level: number;
  optional: boolean;
  hasValue: boolean;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
}

export interface Link {
  source: string | Node;
  target: string | Node;
}

export interface GraphProps {
  hierarchy: Record<string, any>;
  params: Record<string, string>;
  width?: number;
  height?: number;
  optimizationLevel?: 'low' | 'medium' | 'high';
}

export interface SimulationConfig {
  linkDistance?: number;
  chargeStrength?: number;
  alphaDecay?: number;
  velocityDecay?: number;
}

export interface PerformanceMetrics {
  nodesCount: number;
  linksCount: number;
  renderTime: number;
  simulationTime: number;
  lastUpdated: number;
}
