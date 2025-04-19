
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

export const ValidationTab = () => {
  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-4">
        <section>
          <h3 className="text-lg font-semibold">Validation Rule Builder</h3>
          <p className="text-muted-foreground">
            The ValidationRuleBuilder provides a fluent API for creating complex validation rules.
          </p>
          
          <div className="bg-muted p-4 rounded-md mt-4">
            <p className="text-sm font-mono mb-2">Basic Rules</p>
            <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-auto text-xs">
              {`import { ValidationRuleBuilder } from '@/utils/navigation/parameters/nestedParameterHandler';

// Create validation rules
const rules = {
  id: new ValidationRuleBuilder().string().required().build(),
  age: new ValidationRuleBuilder().number().build(),
  email: new ValidationRuleBuilder().pattern(/^.+@.+\\..+$/).build()
};`}
            </pre>
          </div>
          
          <div className="bg-muted p-4 rounded-md mt-4">
            <p className="text-sm font-mono mb-2">Prebuilt Rule Presets</p>
            <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-auto text-xs">
              {`import { ValidationRuleBuilder } from '@/utils/navigation/parameters/nestedParameterHandler';

// Use presets for common validations
const rules = {
  email: ValidationRuleBuilder.presets.email().build(),
  slug: ValidationRuleBuilder.presets.slug().build(),
  uuid: ValidationRuleBuilder.presets.uuid().build()
};`}
            </pre>
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold mt-6">Available Validation Types</h3>
          <Table className="mt-2">
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Example</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>string</TableCell>
                <TableCell>Validates that the parameter is a string</TableCell>
                <TableCell><code>.string()</code></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>number</TableCell>
                <TableCell>Validates that the parameter is a number</TableCell>
                <TableCell><code>.number()</code></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>pattern</TableCell>
                <TableCell>Validates against a regular expression</TableCell>
                <TableCell><code>.pattern(/^[a-z0-9-]+$/)</code></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>required</TableCell>
                <TableCell>Ensures parameter is not empty</TableCell>
                <TableCell><code>.required()</code></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>custom</TableCell>
                <TableCell>Custom validator function</TableCell>
                <TableCell><code>.custom(val =&gt; val.length &gt; 5)</code></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>
      </div>
    </ScrollArea>
  );
};
