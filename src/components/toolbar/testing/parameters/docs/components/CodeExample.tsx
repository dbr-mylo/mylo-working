
import React from 'react';

interface CodeExampleProps {
  title?: string;
  code: string;
}

export const CodeExample: React.FC<CodeExampleProps> = ({ title, code }) => {
  return (
    <div className="bg-muted p-4 rounded-md mt-4">
      {title && <p className="text-sm font-mono mb-2">{title}</p>}
      <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-auto text-xs">
        {code}
      </pre>
    </div>
  );
};
