
import type { ValidationRule } from './types';

export class ValidationRuleBuilder {
  private rule: ValidationRule = {};
  
  constructor() {
    this.rule = {
      required: false
    };
  }
  
  required(): ValidationRuleBuilder {
    this.rule.required = true;
    return this;
  }
  
  optional(): ValidationRuleBuilder {
    this.rule.required = false;
    return this;
  }
  
  string(): ValidationRuleBuilder {
    this.rule.type = 'string';
    return this;
  }
  
  number(): ValidationRuleBuilder {
    this.rule.type = 'number';
    return this;
  }
  
  boolean(): ValidationRuleBuilder {
    this.rule.type = 'boolean';
    return this;
  }
  
  minLength(length: number): ValidationRuleBuilder {
    this.rule.minLength = length;
    return this;
  }
  
  maxLength(length: number): ValidationRuleBuilder {
    this.rule.maxLength = length;
    return this;
  }
  
  pattern(regex: RegExp): ValidationRuleBuilder {
    this.rule.pattern = regex;
    return this;
  }
  
  custom(validator: (value: string) => boolean): ValidationRuleBuilder {
    this.rule.custom = validator;
    return this;
  }
  
  static presets = {
    uuid(): ValidationRuleBuilder {
      return new ValidationRuleBuilder()
        .pattern(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    },
    
    email(): ValidationRuleBuilder {
      return new ValidationRuleBuilder()
        .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    },
    
    slug(): ValidationRuleBuilder {
      return new ValidationRuleBuilder()
        .pattern(/^[a-z0-9-]+$/);
    },
    
    date(): ValidationRuleBuilder {
      return new ValidationRuleBuilder()
        .pattern(/^\d{4}-\d{2}-\d{2}$/);
    }
  };
  
  build(): ValidationRule {
    return { ...this.rule };
  }
}
