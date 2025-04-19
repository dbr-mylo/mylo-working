
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ValidationRule {
  type: string;
  description: string;
  example: string;
}

interface ValidationTableProps {
  rules: ValidationRule[];
}

export const ValidationTable: React.FC<ValidationTableProps> = ({ rules }) => {
  return (
    <Table className="mt-2">
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Example</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rules.map((rule, index) => (
          <TableRow key={index}>
            <TableCell>{rule.type}</TableCell>
            <TableCell>{rule.description}</TableCell>
            <TableCell><code>{rule.example}</code></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
