
import React from 'react';
import { AnalysisSection } from './AnalysisSection';

export const KeyRoleFiles: React.FC = () => {
  return (
    <AnalysisSection title="Key Role-Related Files">
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li><code>src/utils/roles/RoleHooks.tsx</code>: Primary role-checking hooks</li>
        <li><code>src/utils/roles/RoleComponents.tsx</code>: Role-based conditional rendering</li>
        <li><code>src/utils/roles/EditorOnly.tsx</code>: Standalone role component</li>
        <li><code>src/utils/roleConfig.ts</code>: Role feature configuration</li>
        <li><code>src/contexts/AuthContext.tsx</code>: Authentication and role state management</li>
        <li><code>src/components/editor/toolbar/EditorToolbar.tsx</code>: Entry point for toolbar components</li>
        <li><code>src/components/toolbar/writer/*</code>: Writer-specific toolbar components</li>
      </ul>
    </AnalysisSection>
  );
};
