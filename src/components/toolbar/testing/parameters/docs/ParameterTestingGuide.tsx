
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Code } from 'lucide-react';

export const ParameterTestingGuide: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Parameter Testing Guide</CardTitle>
        <CardDescription>
          Comprehensive documentation for the parameter testing and validation system
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="validation">Validation Rules</TabsTrigger>
            <TabsTrigger value="nested">Nested Parameters</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                <section>
                  <h3 className="text-lg font-semibold">Introduction</h3>
                  <p className="text-muted-foreground">
                    The parameter testing system provides comprehensive tools for validating
                    and testing dynamic route parameters, deep linking capabilities, and nested
                    parameter structures.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold">Key Components</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-base">Parameter Extraction</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Extract parameters from route patterns and validate them against actual paths.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-base">Validation Rules</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Apply complex validation rules to ensure parameters meet required formats.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-base">Nested Parameters</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Handle parent-child relationships between parameters in complex routes.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-base">Performance Testing</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Benchmark extraction and validation performance for optimization.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold mt-4">Getting Started</h3>
                  <div className="bg-muted p-4 rounded-md mt-2">
                    <p className="text-sm font-mono mb-2">Basic Parameter Extraction</p>
                    <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-auto text-xs">
                      {`import { extractNestedParameters } from '@/utils/navigation/parameters/nestedParameterHandler';

// Extract parameters from a route
const { params, hierarchy, errors } = extractNestedParameters(
  '/user/:id/profile/:section',
  '/user/123/profile/settings'
);
// Result: { id: '123', section: 'settings' }`}
                    </pre>
                  </div>
                </section>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="validation">
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
                        <TableCell><code>.custom(val => val.length > 5)</code></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </section>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="nested">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                <section>
                  <h3 className="text-lg font-semibold">Nested Parameters Concept</h3>
                  <p className="text-muted-foreground">
                    Nested parameters represent hierarchical relationships between URL parameters,
                    where child parameters depend on their parents.
                  </p>
                  
                  <Alert className="mt-4">
                    <AlertTitle>Important Concept</AlertTitle>
                    <AlertDescription>
                      In nested parameters, if a parent parameter is invalid or missing, all of its
                      child parameters will be considered invalid regardless of their own values.
                    </AlertDescription>
                  </Alert>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold mt-6">Parameter Hierarchy</h3>
                  <div className="bg-muted p-4 rounded-md mt-2">
                    <p className="text-sm font-mono mb-2">Example: Organization → Team → Project → Task</p>
                    <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-auto text-xs">
                      {`// Route pattern
'/org/:orgId/team/:teamId/project/:projectId/task/:taskId'

// Extracted hierarchy
{
  "orgId": [],         // No parents
  "teamId": ["orgId"], // Parent is orgId
  "projectId": ["teamId", "orgId"], // Parents are teamId and orgId
  "taskId": ["projectId", "teamId", "orgId"] // Parents are projectId, teamId, and orgId
}`}
                    </pre>
                  </div>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold mt-6">Parameter Dependencies</h3>
                  <p className="text-muted-foreground">
                    When validating nested parameters, the system checks dependency chains to ensure
                    parent parameters are valid before validating child parameters.
                  </p>
                  
                  <div className="bg-muted p-4 rounded-md mt-4">
                    <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-auto text-xs">
                      {`import { extractNestedParameters, validateNestedParameters } from '@/utils/navigation/parameters/nestedParameterHandler';

// Extract parameters and hierarchy
const { params, hierarchy } = extractNestedParameters(
  '/org/:orgId/team/:teamId',
  '/org/org-123/team/team-456'
);

// Validate with rules
const validationResult = validateNestedParameters(params, hierarchy, {
  orgId: new ValidationRuleBuilder().required().build(),
  teamId: new ValidationRuleBuilder().required().build()
});`}
                    </pre>
                  </div>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold mt-6">Handling Optional Parameters</h3>
                  <p className="text-muted-foreground">
                    Parameters can be marked as optional in route patterns using the '?' suffix.
                  </p>
                  
                  <div className="bg-muted p-4 rounded-md mt-4">
                    <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-auto text-xs">
                      {`// Route pattern with optional parameter
'/products/:category?/:productId'

// This will match all of these paths:
'/products/electronics/123'
'/products//123'`}
                    </pre>
                  </div>
                </section>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="performance">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                <section>
                  <h3 className="text-lg font-semibold">Performance Optimization</h3>
                  <p className="text-muted-foreground">
                    For high-traffic applications, parameter extraction and validation can become
                    performance bottlenecks. Several optimization techniques are available.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold mt-6">Memoization</h3>
                  <p className="text-muted-foreground">
                    The system includes memoized versions of parameter functions to cache results
                    and improve performance for repeated operations.
                  </p>
                  
                  <div className="bg-muted p-4 rounded-md mt-4">
                    <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-auto text-xs">
                      {`import { 
  memoizedExtractNestedParameters,
  memoizedValidateNestedParameters
} from '@/utils/navigation/parameters/memoizedParameterHandler';

// Extract parameters with caching
const result = memoizedExtractNestedParameters(
  '/user/:id/profile/:section',
  '/user/123/profile/settings'
);

// Repeated calls with same arguments will use cached result
const sameResult = memoizedExtractNestedParameters(
  '/user/:id/profile/:section',
  '/user/123/profile/settings'
);`}
                    </pre>
                  </div>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold mt-6">Performance Benchmarking</h3>
                  <p className="text-muted-foreground">
                    The system includes utilities for benchmarking parameter operations to identify
                    performance bottlenecks.
                  </p>
                  
                  <div className="bg-muted p-4 rounded-md mt-4">
                    <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-auto text-xs">
                      {`import { benchmarkOperation } from '@/components/toolbar/testing/parameters/utils/performanceMonitor';
import { extractNestedParameters } from '@/utils/navigation/parameters/nestedParameterHandler';

// Benchmark parameter extraction
const { result, performance } = benchmarkOperation(
  'Parameter Extraction',
  () => extractNestedParameters(
    '/user/:id/profile/:section',
    '/user/123/profile/settings'
  ),
  1000 // Run 1000 iterations
);

console.log(\`Operations per second: \${performance.operationsPerSecond}\`);`}
                    </pre>
                  </div>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold mt-6">Performance Best Practices</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Use memoized functions for repeated operations</li>
                    <li>Minimize the complexity of validation rules for high-traffic routes</li>
                    <li>Consider caching validation results at the application level</li>
                    <li>Use simpler route patterns for frequently accessed routes</li>
                    <li>Balance between validation thoroughness and performance needs</li>
                  </ul>
                </section>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ParameterTestingGuide;
