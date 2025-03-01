
import { Button } from "@/components/ui/button";
import { FileText, Download, Share2, LogOut, Save } from "lucide-react";
import type { EditorNavProps } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

export const EditorNav = ({ currentRole, onSave, content, documentTitle = "Untitled Document", onTitleChange }: EditorNavProps) => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(documentTitle);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value || "Untitled Document";
    setTitle(newTitle);
    if (onTitleChange) {
      onTitleChange(newTitle);
    }
  };

  const handleSave = async () => {
    if (!user || !content) return;
    
    setIsSaving(true);
    try {
      // Check if user has an existing document
      const { data: existingDocs } = await supabase
        .from('documents')
        .select('id')
        .eq('owner_id', user.id)
        .limit(1);
      
      let result;
      
      if (existingDocs && existingDocs.length > 0) {
        // Update existing document
        result = await supabase
          .from('documents')
          .update({ 
            content: content,
            title: title,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingDocs[0].id);
      } else {
        // Create new document
        result = await supabase
          .from('documents')
          .insert({
            content: content,
            owner_id: user.id,
            title: title
          });
      }

      if (result.error) {
        throw new Error(result.error.message);
      }
      
      toast({
        title: "Document saved",
        description: "Your changes have been saved successfully.",
      });
      
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        title: "Error saving document",
        description: "There was a problem saving your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <nav className="h-16 border-b border-editor-border bg-white px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <FileText className="w-6 h-6 text-editor-text" />
        {user && currentRole === "editor" ? (
          <Input 
            className="h-8 w-48 text-editor-heading font-medium focus-visible:ring-1"
            value={title}
            onChange={handleTitleChange}
            placeholder="Document Title"
          />
        ) : (
          <h1 className="text-lg font-medium text-editor-heading">{title}</h1>
        )}
        {user && (
          <span className="text-sm text-editor-text opacity-50">
            ({currentRole})
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {user && currentRole === "editor" && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        )}
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
