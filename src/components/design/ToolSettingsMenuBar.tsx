
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ToolSettingsMenuBarProps {
  children?: React.ReactNode;
  toolbar?: React.ReactNode;
}

export const ToolSettingsMenuBar: React.FC<ToolSettingsMenuBarProps> = ({ children, toolbar }) => {
  const { role } = useAuth();
  const isDesigner = role === "designer";
  
  return (
    <div className="w-full bg-slate-50 border-b border-slate-200">
      <div className="w-full mx-auto">
        {isDesigner && toolbar ? (
          <div>{toolbar}</div>
        ) : children || (
          <div className="flex items-center h-10 px-4">
            <span className="text-sm text-slate-500">Tool settings will appear here</span>
          </div>
        )}
      </div>
    </div>
  );
};
