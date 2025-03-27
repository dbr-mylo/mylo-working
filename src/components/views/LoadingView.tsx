
import React from "react";

export const LoadingView: React.FC = () => {
  return (
    <div className="min-h-screen bg-editor-bg flex items-center justify-center">
      <div className="animate-pulse text-lg">Loading document...</div>
    </div>
  );
};
