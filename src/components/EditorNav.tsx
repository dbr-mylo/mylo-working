
import { Button } from "@/components/ui/button";
import { FileText, Download, Share2, LogOut, ExternalLink } from "lucide-react";
import type { EditorNavProps } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const EditorNav = ({ currentRole }: EditorNavProps) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleExit = () => {
    navigate("/auth");
  };

  return (
    <nav className="h-16 border-b border-editor-border bg-white px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <FileText className="w-6 h-6 text-editor-text" />
        <h1 className="text-lg font-medium text-editor-heading">Brand Document</h1>
        {user && (
          <span className="text-sm text-editor-text opacity-50">
            ({currentRole})
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={handleExit}
        >
          <ExternalLink className="w-4 h-4" />
          Exit
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
        {user && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => signOut()}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        )}
      </div>
    </nav>
  );
};
