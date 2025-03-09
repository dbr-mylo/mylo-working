
import React from "react";
import { Button } from "@/components/ui/button";
import { TextStyle, StyleFormData } from "@/lib/types";

interface StyleFormActionsProps {
  showActions: boolean;
  isUpdate: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const StyleFormActions = ({ 
  showActions, 
  isUpdate, 
  onCancel, 
  onSubmit 
}: StyleFormActionsProps) => {
  if (!showActions) return null;
  
  return (
    <div className="flex justify-end space-x-2 pt-3 border-t mt-3">
      <Button 
        variant="outline" 
        type="button" 
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button type="submit">
        {isUpdate ? "Update Style" : "Create Style"}
      </Button>
    </div>
  );
};
