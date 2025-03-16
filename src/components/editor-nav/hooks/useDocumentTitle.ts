
import { useState, useEffect } from "react";

interface UseDocumentTitleProps {
  initialTitle: string;
  onTitleChange?: (title: string) => Promise<void>;
}

export const useDocumentTitle = ({ initialTitle, onTitleChange }: UseDocumentTitleProps) => {
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const handleTitleBlur = async () => {
    if (onTitleChange && title !== initialTitle) {
      await onTitleChange(title);
    }
  };

  return {
    title,
    handleTitleChange,
    handleTitleBlur
  };
};
