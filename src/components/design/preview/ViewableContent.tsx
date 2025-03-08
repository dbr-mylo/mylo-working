import { useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ViewableContentProps {
  content: string;
  previewRef: React.RefObject<HTMLDivElement>;
  onClick: (e: React.MouseEvent) => void;
}

export const ViewableContent = ({ content, previewRef, onClick }: ViewableContentProps) => {
  const { role } = useAuth();
  const isDesigner = role === "designer";

  if (isDesigner) {
    // For designer role viewing mode, don't wrap in the white div
    return (
      <div 
        ref={previewRef} 
        onClick={onClick}
        dangerouslySetInnerHTML={{ __html: content }} 
        className="cursor-pointer min-h-[11in] w-[8.5in] p-[1in] mx-auto" 
      />
    );
  } 

  // For editor role viewing mode, keep the white div with shadow
  return (
    <div className="min-h-[11in] w-[8.5in] p-[1in] mx-auto bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]">
      <div 
        ref={previewRef} 
        onClick={onClick}
        dangerouslySetInnerHTML={{ __html: content }} 
        className="cursor-pointer" 
      />
    </div>
  );
};
