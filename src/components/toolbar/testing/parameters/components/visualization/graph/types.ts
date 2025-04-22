
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
}

export interface Link {
  source: string;
  target: string;
}

export interface GraphProps {
  hierarchy: Record<string, any>;
  params: Record<string, string>;
}
