
import { useMemo } from "react";
import { Document } from "@/lib/types";
import { useTemplateLoader } from "./useTemplateLoader";
import { useTemplateOperations } from "./useTemplateOperations";
import { transformToDocuments } from "../utils/templateTransform";

/**
 * Hook for managing templates with proper loading, operations, and transformations
 */
export const useTemplateManager = (
  onLoadTemplate?: (doc: Document) => void,
  onClose?: () => void
) => {
  // Load templates based on user role
  const { templates: rawTemplates, isLoading, loadTemplates } = useTemplateLoader();
  
  // Transform templates to Document format for the UI
  const templates = useMemo(() => {
    return transformToDocuments(rawTemplates);
  }, [rawTemplates]);
  
  // Get template operations (delete, select, toggle status)
  const { 
    handleDeleteTemplate, 
    handleSelectTemplate, 
    handleToggleTemplateStatus 
  } = useTemplateOperations({
    onLoadTemplate,
    onClose,
    reloadTemplates: loadTemplates
  });

  return {
    templates,
    isLoading,
    handleDeleteTemplate,
    handleSelectTemplate,
    handleToggleTemplateStatus
  };
};
