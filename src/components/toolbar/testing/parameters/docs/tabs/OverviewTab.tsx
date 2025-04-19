
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export const OverviewTab = () => {
  return (
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
  );
};
