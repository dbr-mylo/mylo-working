
import type { NestedParameter } from './types';

export const detectCyclicalDependencies = (hierarchy: Record<string, NestedParameter>): string[] => {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cycles: string[] = [];

  const dfs = (paramName: string, path: string[] = []): boolean => {
    if (recursionStack.has(paramName)) {
      const cycle = [...path.slice(path.indexOf(paramName)), paramName];
      cycles.push(cycle.join(' → '));
      return true;
    }
    
    if (visited.has(paramName)) return false;
    
    visited.add(paramName);
    recursionStack.add(paramName);
    
    const param = hierarchy[paramName];
    if (param.parent && dfs(param.parent, [...path, paramName])) {
      return true;
    }
    
    for (const child of param.children) {
      if (dfs(child, [...path, paramName])) {
        return true;
      }
    }
    
    recursionStack.delete(paramName);
    return false;
  };

  Object.keys(hierarchy).forEach(paramName => {
    if (!visited.has(paramName)) {
      dfs(paramName);
    }
  });

  return cycles;
};
