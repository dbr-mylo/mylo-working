
import React from 'react';
import { AnalysisSection } from './AnalysisSection';

export const MigrationStrategy: React.FC = () => {
  return (
    <AnalysisSection title="Migration Strategy Recommendations">
      <ol className="list-decimal pl-5 space-y-2">
        <li>
          <strong>Fix <code>useIsWriter</code> hook</strong>: Ensure it properly checks for both "writer" and 
          "editor" roles for backward compatibility.
        </li>
        <li>
          <strong>Refactor <code>StandaloneEditorOnly</code> component</strong>: Update to use the fixed 
          <code>useIsWriter</code> hook and ensure consistency.
        </li>
        <li>
          <strong>Remove redundant role checks</strong>: Toolbar components shouldn't each check roles if 
          parent already does.
        </li>
        <li>
          <strong>Improve <code>EditorToolbar</code></strong>: Either check role once or use role component
          but not both.
        </li>
        <li>
          <strong>Update <code>AuthContext</code></strong>: Make role conversion from "editor" to "writer"
          more explicit and consistent.
        </li>
      </ol>
    </AnalysisSection>
  );
};
