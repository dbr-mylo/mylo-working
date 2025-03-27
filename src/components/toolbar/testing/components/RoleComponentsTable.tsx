
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AnalysisSection } from './AnalysisSection';

export const RoleComponentsTable: React.FC = () => {
  return (
    <AnalysisSection title="Role Components Usage Analysis">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Component Name</TableHead>
            <TableHead>Implementation</TableHead>
            <TableHead>Potential Issues</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell><code>StandaloneEditorOnly</code></TableCell>
            <TableCell>Uses <code>useIsWriter</code> hook but exists in separate path</TableCell>
            <TableCell>Potential conflict with other role components on same element</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><code>WriterOnly</code></TableCell>
            <TableCell>Uses <code>RoleOnly</code> with "writer" role</TableCell>
            <TableCell>No editor role compatibility handling</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><code>EditorOnly</code></TableCell>
            <TableCell>Deprecated, wraps <code>WriterOnly</code></TableCell>
            <TableCell>Adds unnecessary nesting without adding compatibility</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><code>WriterOrAdminOnly</code></TableCell>
            <TableCell>Uses <code>MultiRoleOnly</code> with roles array</TableCell>
            <TableCell>No editor role compatibility handling</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </AnalysisSection>
  );
};
