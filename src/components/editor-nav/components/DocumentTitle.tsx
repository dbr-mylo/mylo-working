
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface DocumentTitleProps {
  title: string;
  onTitleChange: (title: string) => void;
  onTitleBlur: () => Promise<void>;
  isEditable: boolean;
  placeholder: string;
}

export const DocumentTitle = ({ 
  title, 
  onTitleChange, 
  onTitleBlur,
  isEditable,
  placeholder
}: DocumentTitleProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTitleChange(e.target.value);
  };

  return (
    <>
      {isEditable ? (
        <Input 
          className="h-[40px] w-48 text-editor-heading font-medium focus-visible:ring-1 rounded-[7.5px]"
          value={title}
          onChange={handleChange}
          onBlur={onTitleBlur}
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
