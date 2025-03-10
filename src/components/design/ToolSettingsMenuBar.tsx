
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const buttonSize = isDesigner ? "xxs" : "sm";
  
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
                <div className="flex items-center h-full pr-4">
                  <Button
                    variant="outline"
                    size={buttonSize}
                    onClick={onTogglePreview}
                    title={isPreviewVisible ? "Hide preview" : "Show preview"}
                    className="flex items-center gap-2"
                  >
                    {isPreviewVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    Preview
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
                  size={buttonSize}
                  onClick={onTogglePreview}
                  title={isPreviewVisible ? "Hide preview" : "Show preview"}
                  className="flex items-center gap-2"
                >
                  {isPreviewVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  Preview
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
