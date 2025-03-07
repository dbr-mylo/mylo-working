
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

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
    <div className={`w-full bg-white ${!isDesigner ? 'border-b border-slate-200' : ''}`}>
      <div className="flex items-center justify-between w-full">
        <div className="flex-1">
          {isDesigner && toolbar ? (
            <div className="w-full flex items-center justify-between">
              <div className="flex-1">
                {toolbar}
              </div>
              {onTogglePreview && (
                <div className="flex items-center h-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onTogglePreview}
                    title={isPreviewVisible ? "Hide preview" : "Show preview"}
                    className="ml-2 w-[140px] justify-center"
                  >
                    {isPreviewVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                    <span className="ml-2 hidden sm:inline">
                      {isPreviewVisible ? "Hide Preview" : "Show Preview"}
                    </span>
                  </Button>
                </div>
              )}
            </div>
          ) : children || (
            <div className="flex items-center justify-between h-10 px-4">
              <span className="text-sm text-slate-500">Tool settings will appear here</span>
              {isDesigner && onTogglePreview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onTogglePreview}
                  title={isPreviewVisible ? "Hide preview" : "Show preview"}
                  className="w-[140px] justify-center"
                >
                  {isPreviewVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  <span className="ml-2 hidden sm:inline">
                    {isPreviewVisible ? "Hide Preview" : "Show Preview"}
                  </span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
