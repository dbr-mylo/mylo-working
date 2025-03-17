
import { useState } from 'react';

export const useTemplateStyles = (templateId?: string) => {
  const [customStyles, setCustomStyles] = useState('');

  const handleStylesChange = (styles: string) => {
    setCustomStyles(styles);
  };

  return {
    customStyles,
    handleStylesChange
  };
};
