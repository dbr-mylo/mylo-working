
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Columns, LayoutTemplate } from 'lucide-react';

interface ToolSettingsMenuBarProps {
  children?: React.ReactNode;
  toolbar?: React.ReactNode;
  isPreviewVisible?: boolean;
  onTogglePreview?: () => void;
}

export const ToolSettingsMenuBar: React.FC<ToolSettingsMenuBarProps> = ({ 
  children, 
  toolbar, 
  isPreviewVisible = true,
  onTogglePreview 
}) => {
  const { role } = useAuth();
  const isDesigner = role === "designer";
  
  return (
    <div className="w-full bg-slate-50 border-b border-slate-200">
      <div className="w-full mx-auto flex items-center justify-between">
        <div className="flex-1">
          {isDesigner && toolbar ? (
            <div>{toolbar}</div>
          ) : children || (
            <div className="flex items-center h-10 px-4">
              <span className="text-sm text-slate-500">Tool settings will appear here</span>
            </div>
          )}
        </div>
        
        {isDesigner && onTogglePreview && (
          <div className="flex-shrink-0 p-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onTogglePreview}
              title={isPreviewVisible ? "Hide preview" : "Show preview"}
              className="ml-2"
            >
              {isPreviewVisible ? <Columns size={18} /> : <LayoutTemplate size={18} />}
              <span className="ml-2 hidden sm:inline">
                {isPreviewVisible ? "Editor Only" : "Show Preview"}
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
