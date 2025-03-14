
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { validateFontSize } from '../utils';

interface UseFontSizeValidationProps {
  MIN_FONT_SIZE: number;
  MAX_FONT_SIZE: number;
}

export const useFontSizeValidation = ({ 
  MIN_FONT_SIZE, 
  MAX_FONT_SIZE 
}: UseFontSizeValidationProps) => {
  const { toast } = useToast();
  
  const validateSize = useCallback((size: number) => {
    const result = validateFontSize(size);
    
    if (!result.isValid && result.message) {
      toast({
        title: "Font Size Issue",
        description: result.message,
        variant: "destructive",
        duration: 3000
      });
    }
    
    return result;
  }, [toast]);

  return { validateSize };
};
