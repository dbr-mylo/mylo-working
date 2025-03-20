
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface ToolSettingsMenuBarProps {
  children?: React.ReactNode;
  toolbar?: React.ReactNode;
}

export const ToolSettingsMenuBar: React.FC<ToolSettingsMenuBarProps> = ({ 
  children, 
  toolbar
}) => {
  const { role } = useAuth();
  const isDesigner = role === "designer";
  
  return (
    <div className={`w-full bg-white ${!isDesigner ? 'border-b border-slate-200' : ''}`}>
      <div className="flex items-center justify-between w-full">
        <div className="flex-1">
          {isDesigner && toolbar ? (
            <div className="w-full flex items-center justify-between">
              <div className="flex-1">
                {toolbar}
              </div>
            </div>
          ) : children || (
            <div className="flex items-center justify-between h-9 px-4">
              <span className="text-sm text-slate-500">Tool settings will appear here</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
