
import React from "react";
import { AlignJustify } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export enum EmptyStateType {
  Typography = "typography",
  Preview = "preview"
}

export const EmptyState = ({ type = EmptyStateType.Typography }: { type?: EmptyStateType }) => {
  const { role } = useAuth();
  const isDesigner = role === "designer";
  
  if (type === EmptyStateType.Typography) {
    return (
      <div className="py-6 text-center text-gray-500">
        <AlignJustify className="mx-auto h-10 w-10 opacity-20 mb-2" />
        <p className="text-sm">Select text in the document to edit its properties</p>
      </div>
    );
  }
  
  if (type === EmptyStateType.Preview) {
    if (isDesigner) {
      // Designer role empty state without white box
      return (
        <p className="text-editor-text opacity-50 min-h-[11in] w-[8.5in] p-[1in] mx-auto font-editor text-left">
          Content from the editor will appear here with brand styling
        </p>
      );
    } 

    // Editor role empty state with white box and shadow
    return (
      <div className="min-h-[11in] w-[8.5in] mx-auto bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]">
        <p className="text-editor-text opacity-50 font-editor p-[1in] pt-[1in] text-left">
          Content from the editor will appear here with brand styling
        </p>
      </div>
    );
  }
  
  return null;
};
