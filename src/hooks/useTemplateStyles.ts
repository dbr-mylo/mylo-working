
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseTemplateStylesProps {
  templateId?: string;
  initialStyles?: string;
}

export const useTemplateStyles = (
  templateId?: string,
  initialStyles?: string
) => {
  const [customStyles, setCustomStyles] = useState<string>(initialStyles || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!templateId) {
      setCustomStyles(initialStyles || '');
      return;
    }

    const fetchTemplateStyles = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('design_templates')
          .select('styles')
          .eq('id', templateId)
          .eq('status', 'published')
          .single();

        if (error) throw error;

        if (data?.styles) {
          setCustomStyles(data.styles);
        } else {
          setCustomStyles(initialStyles || '');
        }
      } catch (err) {
        console.error('Error fetching template styles:', err);
        setError('Failed to load template styles');
        setCustomStyles(initialStyles || '');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplateStyles();
  }, [templateId, initialStyles]);

  const handleStylesChange = (styles: string) => {
    setCustomStyles(styles);
  };

  return {
    customStyles,
    isLoading,
    error,
    handleStylesChange
  };
};
