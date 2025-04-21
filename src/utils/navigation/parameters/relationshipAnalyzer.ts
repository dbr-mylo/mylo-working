import { NestedParameter } from './types';
import { detectCyclicalDependencies } from './utils';

/**
 * Analyzes parameter relationships to detect issues
 */
export interface RelationshipAnalysisResult {
  cyclicalDependencies: string[];
  redundantParameters: string[];
  deadBranches: string[];
}

/**
 * Analyzes parameter relationships to detect issues in the hierarchy
 * @param hierarchy Parameter hierarchy to analyze
 * @returns Analysis results
 */
export function analyzeParameterRelationships(hierarchy: Record<string, NestedParameter>): RelationshipAnalysisResult {
  // Detect cyclical dependencies
  const cyclicalDependencies = detectCyclicalDependencies(hierarchy);
  
  // Detect redundant parameters (parameters that serve the same function)
  const redundantParameters = detectRedundantParameters(hierarchy);
  
  // Detect dead branches (parameters without extraction paths)
  const deadBranches = detectDeadBranches(hierarchy);
  
  return {
    cyclicalDependencies,
    redundantParameters,
    deadBranches
  };
}

/**
 * Detects parameters that may be redundant (similar pattern/function)
 */
function detectRedundantParameters(hierarchy: Record<string, NestedParameter>): string[] {
  const redundantParams: string[] = [];
  const paramsByChildren: Record<string, string[]> = {};
  
  // Group parameters by their children signatures
  Object.entries(hierarchy).forEach(([paramName, param]) => {
    if (param.children.length === 0) return;
    
    const childrenSignature = [...param.children].sort().join(',');
    if (!paramsByChildren[childrenSignature]) {
      paramsByChildren[childrenSignature] = [];
    }
    paramsByChildren[childrenSignature].push(paramName);
  });
  
  // Find parameter groups with identical children
  Object.values(paramsByChildren).forEach(paramGroup => {
    if (paramGroup.length > 1) {
      // Keep the first one, mark others as redundant
      redundantParams.push(...paramGroup.slice(1).map(p => 
        `${p} (similar to ${paramGroup[0]})`
      ));
    }
  });
  
  return redundantParams;
}

/**
 * Detects parameters that are never used in extraction paths
 */
function detectDeadBranches(hierarchy: Record<string, NestedParameter>): string[] {
  const deadBranches: string[] = [];
  
  // Find parameters that are defined but never referenced as children
  const allChildrenParams = new Set<string>();
  Object.values(hierarchy).forEach(param => {
    param.children.forEach(child => allChildrenParams.add(child));
  });
  
  // Find parameters that aren't children of any other parameter and aren't root
  Object.keys(hierarchy).forEach(paramName => {
    const param = hierarchy[paramName];
    if (!allChildrenParams.has(paramName) && param.parent) {
      deadBranches.push(paramName);
    }
  });
  
  return deadBranches;
}
