
import { Button } from "@/components/ui/button";
import { FileText, Download, Share2 } from "lucide-react";
import type { EditorNavProps } from "@/lib/types";

export const EditorNav = ({ currentRole }: EditorNavProps) => {
  return (
    <nav className="h-16 border-b border-editor-border bg-white px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <FileText className="w-6 h-6 text-editor-text" />
        <h1 className="text-lg font-medium text-editor-heading">Brand Document</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>
    </nav>
  );
};
