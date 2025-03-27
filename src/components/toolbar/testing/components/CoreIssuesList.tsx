
import React from 'react';
import { AnalysisSection } from './AnalysisSection';

export const CoreIssuesList: React.FC = () => {
  return (
    <AnalysisSection title="Core Issues Identified">
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Inconsistent Role Terminology</strong>: Mixing of "editor" and "writer" roles 
          throughout the codebase creates confusion and potential logical errors in role checks.
        </li>
        <li>
          <strong>Incomplete Role Mapping</strong>: Some role checks don't account for backward 
          compatibility between "editor" (legacy) and "writer" (current) role names.
        </li>
        <li>
          <strong>Component Encapsulation Issues</strong>: <code>StandaloneEditorOnly</code> component 
          doesn't properly coordinate with <code>useIsWriter</code> hook.
        </li>
        <li>
          <strong>Decentralized Role Verification</strong>: Role checks are scattered across 
          components, leading to inconsistent application of access control rules.
        </li>
        <li>
          <strong>Toolbar Component Specific Issues</strong>: Writer toolbar components sometimes 
          perform redundant role checks, potentially causing conflicts.
        </li>
      </ul>
    </AnalysisSection>
  );
};
