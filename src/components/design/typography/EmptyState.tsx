
import React from "react";
import { AlignJustify } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="py-6 text-center text-gray-500">
      <AlignJustify className="mx-auto h-10 w-10 opacity-20 mb-2" />
      <p className="text-sm">Select text in the document to edit its properties</p>
    </div>
  );
};
