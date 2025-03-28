
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/utils/errorHandling';

export const useTemplateNotification = (
  templateName: string,
  isLoading: boolean
) => {
  const { toast } = useToast();
  
  useEffect(() => {
    try {
      if (templateName && !isLoading) {
        toast({
          title: 'Template Applied',
          description: `Using template: ${templateName}`,
          duration: 3000,
        });
      }
    } catch (error) {
      handleError(
        error, 
        "useTemplateNotification", 
        "Failed to show template notification"
      );
    }
  }, [templateName, isLoading, toast]);
};
