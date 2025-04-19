
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CodeExample } from '../components/CodeExample';

export const NestedTab = () => {
  return (
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
          <CodeExample
            title="Example: Organization &gt; Team &gt; Project &gt; Task"
            code={`// Route pattern
'/org/:orgId/team/:teamId/project/:projectId/task/:taskId'

// Extracted hierarchy
{
  "orgId": [],         // No parents
  "teamId": ["orgId"], // Parent is orgId
  "projectId": ["teamId", "orgId"], // Parents are teamId and orgId
  "taskId": ["projectId", "teamId", "orgId"] // Parents are projectId, teamId, and orgId
}`}
          />
        </section>

        <section>
          <h3 className="text-lg font-semibold mt-6">Parameter Dependencies</h3>
          <p className="text-muted-foreground">
            When validating nested parameters, the system checks dependency chains to ensure
            parent parameters are valid before validating child parameters.
          </p>
          
          <CodeExample
            title="Parameter Validation with Dependencies"
            code={`import { extractNestedParameters, validateNestedParameters } from '@/utils/navigation/parameters/nestedParameterHandler';

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
          />
        </section>
      </div>
    </ScrollArea>
  );
};
