
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useTemplateNotification = (
  templateName: string,
  isLoading: boolean
) => {
  const { toast } = useToast();
  
  useEffect(() => {
    if (templateName && !isLoading) {
      toast({
        title: 'Template Applied',
        description: `Using template: ${templateName}`,
        duration: 3000,
      });
    }
  }, [templateName, isLoading, toast]);
};
