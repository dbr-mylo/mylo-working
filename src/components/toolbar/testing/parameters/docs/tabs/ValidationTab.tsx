
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CodeExample } from '../components/CodeExample';
import { ValidationTable } from '../components/ValidationTable';

const validationRules = [
  {
    type: 'string',
    description: 'Validates that the parameter is a string',
    example: '.string()'
  },
  {
    type: 'number',
    description: 'Validates that the parameter is a number',
    example: '.number()'
  },
  {
    type: 'pattern',
    description: 'Validates against a regular expression',
    example: '.pattern(/^[a-z0-9-]+$/)'
  },
  {
    type: 'required',
    description: 'Ensures parameter is not empty',
    example: '.required()'
  },
  {
    type: 'custom',
    description: 'Custom validator function',
    example: '.custom(val => val.length > 5)'
  }
];

export const ValidationTab = () => {
  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-4">
        <section>
          <h3 className="text-lg font-semibold">Validation Rule Builder</h3>
          <p className="text-muted-foreground">
            The ValidationRuleBuilder provides a fluent API for creating complex validation rules.
          </p>
          
          <CodeExample 
            title="Basic Rules"
            code={`import { ValidationRuleBuilder } from '@/utils/navigation/parameters/nestedParameterHandler';

// Create validation rules
const rules = {
  id: new ValidationRuleBuilder().string().required().build(),
  age: new ValidationRuleBuilder().number().build(),
  email: new ValidationRuleBuilder().pattern(/^.+@.+\\..+$/).build()
};`}
          />
          
          <CodeExample 
            title="Prebuilt Rule Presets"
            code={`import { ValidationRuleBuilder } from '@/utils/navigation/parameters/nestedParameterHandler';

// Use presets for common validations
const rules = {
  email: ValidationRuleBuilder.presets.email().build(),
  slug: ValidationRuleBuilder.presets.slug().build(),
  uuid: ValidationRuleBuilder.presets.uuid().build()
};`}
          />
        </section>
        
        <section>
          <h3 className="text-lg font-semibold mt-6">Available Validation Types</h3>
          <ValidationTable rules={validationRules} />
        </section>
      </div>
    </ScrollArea>
  );
};
