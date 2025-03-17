
import { PlusCircle } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="p-4 text-center bg-muted/20 rounded-md border border-dashed border-muted">
      <div className="flex flex-col items-center justify-center space-y-2">
        <PlusCircle className="h-8 w-8 text-muted stroke-[1.25px]" />
        <div className="space-y-1">
          <p className="text-sm font-medium">No styles created yet</p>
          <p className="text-xs text-muted-foreground">
            Create your first text style to get started
          </p>
        </div>
      </div>
    </div>
  );
};
