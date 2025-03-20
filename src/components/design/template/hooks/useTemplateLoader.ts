
import { useState, useEffect } from "react";
import { Template } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { templateErrorHandler } from "@/services/template/TemplateErrorHandler";

/**
 * Hook for loading templates based on user role
 */
export const useTemplateLoader = () => {
  const { user, role } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadTemplates();
  }, [user, role]);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      // Use different loading strategy based on role
      if (role === 'designer') {
        // Designers can see all templates (previously admin capability)
        const { data, error } = await supabase
          .from('design_templates')
          .select('id, name, styles, owner_id, status, category, version, created_at, updated_at')
          .order('updated_at', { ascending: false });
          
        if (error) throw error;
        setTemplates(data as Template[]);
      } else {
        // Editors only see published templates
        const { data, error } = await supabase
          .from('design_templates')
          .select('id, name, styles, owner_id, status, category, version, created_at, updated_at')
          .eq('status', 'published')
          .order('updated_at', { ascending: false });
          
        if (error) throw error;
        setTemplates(data as Template[]);
      }
    } catch (error) {
      templateErrorHandler.handleError('loading templates', error);
      setTemplates([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    templates,
    isLoading,
    loadTemplates
  };
};
