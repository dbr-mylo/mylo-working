
import React from 'react';

interface ToolSettingsMenuBarProps {
  children?: React.ReactNode;
}

export const ToolSettingsMenuBar: React.FC<ToolSettingsMenuBarProps> = ({ children }) => {
  return (
    <div className="w-full bg-slate-50 border-b border-slate-200">
      <div className="w-[8.5in] mx-auto">
        {children || (
          <div className="flex items-center h-10 px-4">
            <span className="text-sm text-slate-500">Tool settings will appear here</span>
          </div>
        )}
      </div>
    </div>
  );
};
