
import { useAuth } from "@/contexts/AuthContext";

export const EmptyContent = () => {
  const { role } = useAuth();
  const isDesigner = role === "designer";

  if (isDesigner) {
    // Designer role empty state without white box
    return (
      <p className="text-editor-text opacity-50 min-h-[11in] w-[8.5in] p-[1in] mx-auto font-editor">
        Content from the editor will appear here with brand styling
      </p>
    );
  } 

  // Editor role empty state with white box and shadow
  return (
    <div className="min-h-[11in] w-[8.5in] p-[1in] mx-auto bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]">
      <p className="text-editor-text opacity-50 font-editor">
        Content from the editor will appear here with brand styling
      </p>
    </div>
  );
};
