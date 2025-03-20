
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
  const isEditor = role === "editor";
  
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
  
  // Load template from database with timeout protection
  useEffect(() => {
    const loadTemplate = async () => {
      if (templateId && isEditor) {
        setIsTemplateLoading(true);
        
        // Set timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          console.warn("Template loading timed out");
          setIsTemplateLoading(false);
          toast({
            title: "Template loading timed out",
            description: "Using default styles instead.",
            variant: "destructive",
          });
        }, 8000); // 8 second timeout
        
        try {
          // Create a timeout promise
          const timeoutPromise = new Promise<{ data: null, error: Error }>((_, reject) => {
            setTimeout(() => {
              const timeoutError = new Error('Template fetch timeout');
              reject({ data: null, error: timeoutError });
            }, 5000); // 5 second timeout
          });
          
          // Create fetch promise
          const fetchPromise = supabase
            .from('design_templates')
            .select('*')
            .eq('id', templateId)
            .eq('status', 'published')
            .maybeSingle();
          
          // Race the promises
          const { data: template, error } = await Promise.race([fetchPromise, timeoutPromise])
            .catch(err => {
              console.error("Template fetch error or timeout:", err);
              return { data: null, error: err };
            });
          
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
            
            // Also save to local cache
            await templateStore.saveTemplate({
              id: template.id,
              name: template.name,
              styles: template.styles,
              status: template.status as 'draft' | 'published',
              category: template.category,
              version: template.version
            });
            
            // Record template usage relationship if user is authenticated
            if (user?.id && documentId) {
              try {
                const { data: existingRelation } = await supabase
                  .from('document_templates')
                  .select('id')
                  .eq('document_id', documentId)
                  .eq('template_id', templateId)
                  .maybeSingle();
                
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
          } else {
            // Try to load from local storage as fallback
            const localTemplate = await templateStore.getTemplateById(templateId);
            if (localTemplate) {
              setTemplateStyles(localTemplate.styles);
              setTemplateName(localTemplate.name);
              setTemplateVersion(localTemplate.version || 1);
            }
          }
        } catch (error) {
          console.error("Error loading template:", error);
          toast({
            title: "Error loading template",
            description: "Using fallback styles instead.",
            variant: "destructive",
          });
        } finally {
          clearTimeout(timeoutId);
          setIsTemplateLoading(false);
        }
      } else if (isDesigner) {
        setTemplateStyles(customStyles);
      }
    };
    
    loadTemplate();
  }, [templateId, customStyles, isEditor, isDesigner, user, documentId, toast]);
  
  return {
    templateStyles,
    templateName,
    templateVersion,
    isTemplateLoading
  };
};
