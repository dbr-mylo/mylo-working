
import { useEffect, useRef } from "react";
import { smokeTestRunner } from "@/utils/testing/smokeTesting";

/**
 * Hook to run smoke tests on component render
 * 
 * @param componentName - Name of the component being tested
 * @param deps - Optional dependency array (similar to useEffect)
 */
export const useSmokeTest = (componentName: string, deps: React.DependencyList = []) => {
  const hasRendered = useRef(false);
  
  useEffect(() => {
    // Only run once per render cycle
    if (!hasRendered.current) {
      smokeTestRunner.testComponentRender(componentName, () => {
        // This executes during render - if it doesn't throw, the component rendered
        hasRendered.current = true;
      });
    }
    
    return () => {
      // Reset on unmount
      hasRendered.current = false;
    };
  }, deps);
  
  return {
    reportError: (error: unknown) => {
      console.error(`Error in ${componentName}:`, error);
    }
  };
};
