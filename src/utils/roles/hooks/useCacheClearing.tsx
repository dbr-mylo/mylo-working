
import { useState } from 'react';
import { toast } from 'sonner';
import { useCacheClearer } from './useCacheClearer';

/**
 * @deprecated Use useCacheClearer instead
 * 
 * Legacy hook for clearing application caches
 * Maintained for backward compatibility
 */
export const useCacheClearing = () => {
  const { isClearing, clearAllCaches } = useCacheClearer();
  return { isClearing, clearAllCaches };
};
