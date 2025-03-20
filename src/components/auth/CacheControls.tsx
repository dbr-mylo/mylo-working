
import React from 'react';
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useCacheClearing } from "@/utils/roles";
import { useIsAdmin } from "@/utils/roles";
import { useAuth } from "@/contexts/AuthContext";

export const CacheControls = () => {
  const { isClearing, clearAllCaches } = useCacheClearing();
  const isAdmin = useIsAdmin();
  const { user } = useAuth();
  
  // Only show admin controls if the user is both authenticated and has admin role
  if (!isAdmin || !user) return null;

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Admin Controls</h3>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 w-full justify-center"
        onClick={clearAllCaches}
        disabled={isClearing}
      >
        <RotateCcw className={`w-4 h-4 ${isClearing ? 'animate-spin' : ''}`} />
        Clear Application Caches
      </Button>
      <p className="text-xs text-gray-500 mt-2">
        Clears browser storage and memory caches used by the editor
      </p>
    </div>
  );
};
