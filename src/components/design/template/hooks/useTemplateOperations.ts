
import { useState } from "react";
import { Document } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { templateErrorHandler } from "@/services/template/TemplateErrorHandler";

interface UseTemplateOperationsProps {
  onLoadTemplate?: (doc: Document) => void;
  onClose?: () => void;
  reloadTemplates: () => Promise<void>;
}

/**
 * Hook for template operations (delete, select, toggle status)
 */
export const useTemplateOperations = ({
  onLoadTemplate,
  onClose,
  reloadTemplates
}: UseTemplateOperationsProps) => {

  const handleDeleteTemplate = async (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation();
    
    try {
      // Check if any documents are using this template
      const { data: usageData, error: usageError } = await supabase
        .from('document_templates')
        .select('document_id')
        .eq('template_id', templateId);
        
      if (usageError) throw usageError;
      
      if (usageData && usageData.length > 0) {
        // Template is in use
        templateErrorHandler.handleError('deleting template', 
          new Error(`Template is currently used by ${usageData.length} document(s)`));
        return;
      }
      
      // Delete the template
      const { error } = await supabase
        .from('design_templates')
        .delete()
        .eq('id', templateId);
        
      if (error) throw error;
      
      // Update the local state by triggering a reload
      await reloadTemplates();
      
      templateErrorHandler.handleSuccess('deleted');
    } catch (error) {
      templateErrorHandler.handleError('deleting template', error);
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    if (!onLoadTemplate) return;
    
    // Find the template in the documents array
    const selectedTemplate = document.getElementById(`template-${templateId}`);
    if (selectedTemplate && selectedTemplate.dataset.document) {
      try {
        const doc = JSON.parse(selectedTemplate.dataset.document) as Document;
        onLoadTemplate(doc);
        if (onClose) onClose();
      } catch (error) {
        templateErrorHandler.handleError('selecting template', error);
      }
    }
  };

  const handleToggleTemplateStatus = async (templateId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      
      // Update the template status
      const { error } = await supabase
        .from('design_templates')
        .update({ status: newStatus })
        .eq('id', templateId);
        
      if (error) throw error;
      
      // Update local state by triggering a reload
      await reloadTemplates();
      
      templateErrorHandler.handleSuccess(newStatus === 'published' ? 'published' : 'unpublished');
    } catch (error) {
      templateErrorHandler.handleError('updating template status', error);
    }
  };

  return {
    handleDeleteTemplate,
    handleSelectTemplate,
    handleToggleTemplateStatus
  };
};
