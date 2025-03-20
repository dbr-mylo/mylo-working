
import React from 'react';
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import { useCacheClearer } from "@/utils/roles/hooks/useCacheClearer";
import { useIsDesigner } from "@/utils/roles";

/**
 * Component that provides cache clearing controls
 * Only visible to users with the designer role
 */
export const CacheClearingControls = () => {
  const { isClearing, clearAllCaches } = useCacheClearer();
  const isDesigner = useIsDesigner();

  if (!isDesigner) return null;

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">System Management</h3>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 w-full justify-center"
        onClick={clearAllCaches}
        disabled={isClearing}
      >
        {isClearing ? (
          <RotateCcw className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
        Clear All Caches
      </Button>
      <p className="text-xs text-gray-500 mt-2">
        Clears all browser storage, memory caches, and template caches
      </p>
    </div>
  );
};
