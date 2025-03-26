
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { templateStore } from "@/stores/templateStore";

export const useTemplateStyles = (templateId?: string, initialStyles: string = "") => {
  const { role } = useAuth();
  const { toast } = useToast();
  const isEditor = role === "writer"; // Updated to check for 'writer' role
  const [customStyles, setCustomStyles] = useState<string>(initialStyles);
  
  useEffect(() => {
    const loadTemplateStyles = async () => {
      if (templateId && isEditor) {
        try {
          const template = await templateStore.getTemplateById(templateId);
          if (template) {
            setCustomStyles(template.styles);
            toast({
              title: "Template Applied",
              description: `The "${template.name}" template is applied to the preview.`,
              duration: 3000,
            });
          }
        } catch (error) {
          console.error("Error loading template:", error);
        }
      }
    };
    
    loadTemplateStyles();
  }, [templateId, isEditor, toast]);
  
  const handleStylesChange = (styles: string) => {
    setCustomStyles(styles);
  };
  
  return { customStyles, handleStylesChange };
};
