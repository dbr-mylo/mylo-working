
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface DocumentTitleProps {
  title: string;
  onTitleChange?: (title: string) => Promise<void>;
  isEditable: boolean;
  placeholder: string;
}

export const DocumentTitle = ({ 
  title, 
  onTitleChange, 
  isEditable,
  placeholder
}: DocumentTitleProps) => {
  const [localTitle, setLocalTitle] = useState(title);

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);
  };

  const handleTitleBlur = async () => {
    if (onTitleChange && localTitle !== title) {
      await onTitleChange(localTitle);
    }
  };

  return (
    <>
      {isEditable ? (
        <Input 
          className="h-[28px] w-48 text-editor-heading font-medium focus-visible:ring-1 rounded-[7.5px]"
          value={localTitle}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          placeholder={placeholder}
        />
      ) : (
        <h1 className="text-base font-medium text-editor-heading">
          {title || placeholder}
        </h1>
      )}
    </>
  );
};
