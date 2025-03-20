
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

/**
 * Custom hook to handle template notification logic
 * Shows toast notifications when templates are applied for editors
 */
export const useTemplateNotification = (
  templateName: string,
  isLoadingTemplate: boolean
) => {
  const { role } = useAuth();
  const { toast } = useToast();
  const [prevTemplateName, setPrevTemplateName] = useState(templateName);
  
  // Notify user when template changes
  useEffect(() => {
    if (templateName && templateName !== prevTemplateName && role === "editor") {
      toast({
        title: "Template Applied",
        description: `The "${templateName}" template has been applied to your document.`,
        duration: 3000,
      });
      setPrevTemplateName(templateName);
    }
  }, [templateName, prevTemplateName, toast, role]);

  return {
    prevTemplateName
  };
};
