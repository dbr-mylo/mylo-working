
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
