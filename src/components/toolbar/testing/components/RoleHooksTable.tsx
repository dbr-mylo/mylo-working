
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AnalysisSection } from './AnalysisSection';

export const RoleHooksTable: React.FC = () => {
  return (
    <AnalysisSection title="Role Hook Implementation Patterns">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hook Name</TableHead>
            <TableHead>Implementation</TableHead>
            <TableHead>Issues</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell><code>useIsWriter</code></TableCell>
            <TableCell>Directly checks if role is "writer"</TableCell>
            <TableCell>Doesn't account for "editor" legacy role compatibility</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><code>useIsEditor</code></TableCell>
            <TableCell>Deprecated, calls <code>useIsWriter</code></TableCell>
            <TableCell>Adds indirection without ensuring backward compatibility</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><code>useIsDesigner</code></TableCell>
            <TableCell>Directly checks if role is "designer"</TableCell>
            <TableCell>No direct issues, consistent implementation</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><code>useHasAnyRole</code></TableCell>
            <TableCell>Checks if role is in provided array</TableCell>
            <TableCell>Correct implementation but under-utilized</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </AnalysisSection>
  );
};
