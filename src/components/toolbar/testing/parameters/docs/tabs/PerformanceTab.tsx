
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export const PerformanceTab = () => {
  return (
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
  );
};
