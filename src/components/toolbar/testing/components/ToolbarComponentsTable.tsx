
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AnalysisSection } from './AnalysisSection';

export const ToolbarComponentsTable: React.FC = () => {
  return (
    <AnalysisSection title="Toolbar Component Role Check Analysis">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Component</TableHead>
            <TableHead>Role Check Method</TableHead>
            <TableHead>Issues</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell><code>WriterFormatButtonGroup</code></TableCell>
            <TableCell>Uses <code>useIsWriter</code> internally + warning</TableCell>
            <TableCell>Double checking - parent likely already checked role</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><code>WriterListButtonGroup</code></TableCell>
            <TableCell>Uses <code>useIsWriter</code> internally + warning</TableCell>
            <TableCell>Double checking - parent likely already checked role</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><code>WriterAlignmentButtonGroup</code></TableCell>
            <TableCell>Uses <code>useIsWriter</code> internally + warning</TableCell>
            <TableCell>Double checking - parent likely already checked role</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><code>WriterIndentButtonGroup</code></TableCell>
            <TableCell>Uses <code>useIsWriter</code> internally + warning</TableCell>
            <TableCell>Double checking - parent likely already checked role</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><code>WriterClearFormattingButton</code></TableCell>
            <TableCell>Uses <code>useIsWriter</code> internally + warning</TableCell>
            <TableCell>Double checking - parent likely already checked role</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><code>EditorToolbar</code></TableCell>
            <TableCell>Uses <code>useIsWriter</code> and early returns</TableCell>
            <TableCell>Already checking role but wraps children in <code>StandaloneEditorOnly</code></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </AnalysisSection>
  );
};
