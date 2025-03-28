
import React from 'react';

interface DashboardFooterProps {
  isDevelopment: boolean;
}

export const DashboardFooter: React.FC<DashboardFooterProps> = ({ isDevelopment }) => {
  return (
    <div className="text-sm text-gray-500 flex justify-between">
      <span>
        Smoke tests run automatically when components mount. Failed tests are logged to the console.
      </span>
      <span className="text-xs text-muted-foreground">
        {isDevelopment ? "Development Mode" : "Production Mode"}
      </span>
    </div>
  );
};
