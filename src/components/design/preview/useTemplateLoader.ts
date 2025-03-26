import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { templateStore } from "@/stores/templateStore";
import { extractDimensionsFromCSS, generateDimensionsCSS } from "@/utils/templateUtils";

interface UseTemplateLoaderProps {
  templateId?: string;
  customStyles: string;
  documentId?: string | null;
}

export const useTemplateLoader = ({ 
  templateId, 
  customStyles,
  documentId 
}: UseTemplateLoaderProps) => {
  const { role, user } = useAuth();
  const { toast } = useToast();
  const isDesigner = role === "designer";
  const isEditor = role === "writer"; // Updated to check for 'writer' role
  
  const [templateStyles, setTemplateStyles] = useState(customStyles);
  const [templateName, setTemplateName] = useState('');
  const [templateVersion, setTemplateVersion] = useState(1);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  
  // Ensure template includes dimensions
  useEffect(() => {
    if (templateStyles) {
      const dimensions = extractDimensionsFromCSS(templateStyles);
      
      if (!dimensions) {
        const defaultDimensionsCSS = generateDimensionsCSS();
        setTemplateStyles(prev => prev + defaultDimensionsCSS);
      }
    }
  }, [templateStyles]);
  
  // Load template from database
  useEffect(() => {
    const loadTemplate = async () => {
      if (templateId && isEditor) {
        setIsTemplateLoading(true);
        try {
          const { data: template, error } = await supabase
            .from('design_templates')
            .select('*')
            .eq('id', templateId)
            .eq('status', 'published')
            .single();
          
          if (error) throw error;
          
          if (template) {
            let styles = template.styles;
            
            const dimensions = extractDimensionsFromCSS(styles);
            if (!dimensions) {
              styles += generateDimensionsCSS();
            }
            
            setTemplateStyles(styles);
            setTemplateName(template.name);
            setTemplateVersion(template.version || 1);
            
            await templateStore.saveTemplate({
              id: template.id,
              name: template.name,
              styles: template.styles,
              status: template.status as 'draft' | 'published',
              category: template.category,
              version: template.version
            });
            
            if (user?.id && documentId) {
              try {
                const { data: existingRelation } = await supabase
                  .from('document_templates')
                  .select('id')
                  .eq('document_id', documentId)
                  .eq('template_id', templateId)
                  .single();
                
                if (!existingRelation) {
                  await supabase
                    .from('document_templates')
                    .insert({
                      document_id: documentId,
                      template_id: templateId,
                      template_version: template.version || 1
                    });
                } else {
                  await supabase
                    .from('document_templates')
                    .update({
                      template_version: template.version || 1,
                      applied_at: new Date().toISOString()
                    })
                    .eq('document_id', documentId)
                    .eq('template_id', templateId);
                }
              } catch (e) {
                console.error("Error recording template usage:", e);
              }
            }
          }
        } catch (error) {
          console.error("Error loading template:", error);
        } finally {
          setIsTemplateLoading(false);
        }
      } else if (isDesigner) {
        setTemplateStyles(customStyles);
      }
    };
    
    loadTemplate();
  }, [templateId, customStyles, isEditor, isDesigner, user, documentId]);
  
  return {
    templateStyles,
    templateName,
    templateVersion,
    isTemplateLoading
  };
};
