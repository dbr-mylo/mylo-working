
export interface NestedParameter {
  name: string;
  isOptional: boolean;
  parent?: string;
  children: string[];
  level: number;
}

export interface NestedParameterResult {
  params: Record<string, string>;
  hierarchy: Record<string, NestedParameter>;
  missingRequired: string[];
  errors: string[];
  performance: {
    extractionTime: number;
    validationTime?: number;
  };
}

export type ValidationRule = {
  type?: 'string' | 'number' | 'boolean';
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
};

// New types for memoization
export interface SimplifiedHierarchy {
  [key: string]: string[];
}

export interface CacheOptions {
  maxSize?: number;
  ttl?: number; // time to live in milliseconds
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  size: number;
  createdAt: number;
  lastCleanup?: number;
}

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  lastAccessed: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  performance?: {
    validationTime: number;
  };
}
