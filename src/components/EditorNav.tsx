
import { Button } from "@/components/ui/button";
import { FileText, Download, Share2, LogOut, Save, FolderOpen } from "lucide-react";
import type { EditorNavProps, Document } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const EditorNav = ({ 
  currentRole, 
  onSave, 
  content, 
  documentTitle = "Untitled Document", 
  onTitleChange,
  onLoadDocument 
}: EditorNavProps) => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(documentTitle);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [titlePlaceholder, setTitlePlaceholder] = useState("Document Title");

  // Update local title when documentTitle prop changes
  useEffect(() => {
    setTitle(documentTitle);
  }, [documentTitle]);

  // Fetch user documents on mount
  useEffect(() => {
    fetchUserDocuments();
  }, [user]);

  const fetchUserDocuments = async () => {
    setIsLoadingDocs(true);
    try {
      if (user) {
        // Fetch documents from Supabase
        const { data, error } = await supabase
          .from('documents')
          .select('id, title, content, updated_at')
          .eq('owner_id', user.id)
          .order('updated_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          setDocuments(data);
        }
      } else {
        // Try to load from localStorage for guest users
        try {
          const localDocs = localStorage.getItem('guestDocuments');
          if (localDocs) {
            setDocuments(JSON.parse(localDocs));
          }
        } catch (error) {
          console.error("Error loading local documents:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error loading documents",
        description: "There was a problem loading your documents.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value || "Untitled Document";
    setTitle(newTitle);
    if (onTitleChange) {
      onTitleChange(newTitle);
    }
  };

  const handleTitleFocus = () => {
    // Clear the title if it's the default "Untitled Document"
    if (title === "Untitled Document") {
      setTitle("");
    }
  };

  const handleTitleBlur = () => {
    // If user leaves the field empty, revert to "Untitled Document"
    if (!title.trim()) {
      setTitle("Untitled Document");
      if (onTitleChange) {
        onTitleChange("Untitled Document");
      }
    }
  };

  const handleLoadDocument = (doc: Document) => {
    if (onLoadDocument) {
      onLoadDocument(doc);
      toast({
        title: "Document loaded",
        description: `"${doc.title}" has been loaded.`,
      });
    }
  };

  const handleSave = async () => {
    if (!content) {
      toast({
        title: "Cannot save empty document",
        description: "Please add some content to your document.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    try {
      // Check if user has an existing document
      let result;
      let savedDocument: Document | null = null;

      if (user) {
        // User is logged in, save to their account
        const { data: existingDocs } = await supabase
          .from('documents')
          .select('id')
          .eq('owner_id', user.id)
          .eq('title', title)
          .limit(1);
        
        if (existingDocs && existingDocs.length > 0) {
          // Update existing document
          const { data, error } = await supabase
            .from('documents')
            .update({ 
              content: content,
              title: title,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingDocs[0].id)
            .select('id, title, content, updated_at')
            .single();
          
          if (error) throw new Error(error.message);
          savedDocument = data;
        } else {
          // Create new document
          const { data, error } = await supabase
            .from('documents')
            .insert({
              content: content,
              owner_id: user.id,
              title: title
            })
            .select('id, title, content, updated_at')
            .single();
          
          if (error) throw new Error(error.message);
          savedDocument = data;
        }

        // Refresh documents list
        fetchUserDocuments();
      } else {
        // Guest user - use local storage
        const newDoc: Document = {
          id: Date.now().toString(),
          title: title,
          content: content || '',
          updated_at: new Date().toISOString()
        };
        
        // Update current document in localStorage
        localStorage.setItem('guestDocument', JSON.stringify({
          content: content,
          title: title,
          updated_at: new Date().toISOString()
        }));
        
        // Also add to guestDocuments array for document history
        let guestDocs: Document[] = [];
        const storedDocs = localStorage.getItem('guestDocuments');
        
        if (storedDocs) {
          guestDocs = JSON.parse(storedDocs);
          // Check if doc with same title exists and update it
          const existingIndex = guestDocs.findIndex(doc => doc.title === title);
          
          if (existingIndex >= 0) {
            guestDocs[existingIndex] = newDoc;
          } else {
            guestDocs.unshift(newDoc);
          }
        } else {
          guestDocs = [newDoc];
        }
        
        localStorage.setItem('guestDocuments', JSON.stringify(guestDocs));
        setDocuments(guestDocs);
        savedDocument = newDoc;
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
        {currentRole === "editor" ? (
          <Input 
            className="h-8 w-48 text-editor-heading font-medium focus-visible:ring-1"
            value={title}
            onChange={handleTitleChange}
            onFocus={handleTitleFocus}
            onBlur={handleTitleBlur}
            placeholder={titlePlaceholder}
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
        {currentRole === "editor" && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  disabled={isLoadingDocs}
                >
                  <FolderOpen className="w-4 h-4" />
                  {isLoadingDocs ? "Loading..." : "Open"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto">
                {documents.length === 0 ? (
                  <DropdownMenuItem disabled>No documents found</DropdownMenuItem>
                ) : (
                  documents.map((doc) => (
                    <DropdownMenuItem 
                      key={doc.id} 
                      onClick={() => handleLoadDocument(doc)}
                      className="flex flex-col items-start"
                    >
                      <span className="font-medium">{doc.title}</span>
                      <span className="text-xs opacity-70">
                        {new Date(doc.updated_at).toLocaleString()}
                      </span>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

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
          </>
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
