import { Button } from "@/components/ui/button";
import { FileText, Download, Share2, LogOut, Save, FolderOpen, X } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

export const EditorNav = ({ 
  currentRole, 
  onSave, 
  content, 
  documentTitle = "", 
  onTitleChange,
  onLoadDocument,
  initialContent = "" 
}: EditorNavProps) => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(documentTitle);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [titlePlaceholder, setTitlePlaceholder] = useState("Create Document Title");
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTitle(documentTitle);
  }, [documentTitle]);

  useEffect(() => {
    fetchUserDocuments();
  }, [user]);

  const fetchUserDocuments = async () => {
    setIsLoadingDocs(true);
    try {
      if (user) {
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

  const hasUnsavedChanges = () => {
    return content !== initialContent || title !== documentTitle;
  };

  const handleCloseDocument = () => {
    if (hasUnsavedChanges()) {
      setShowCloseDialog(true);
    } else {
      navigateToDocumentList();
    }
  };

  const navigateToDocumentList = () => {
    navigate('/');
  };

  const handleCloseWithoutSaving = () => {
    setShowCloseDialog(false);
    navigateToDocumentList();
  };

  const handleSaveAndClose = async () => {
    setShowCloseDialog(false);
    await handleSave();
    navigateToDocumentList();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (onTitleChange) {
      onTitleChange(newTitle);
    }
  };

  const handleTitleFocus = () => {
  };

  const handleTitleBlur = () => {
    if (onTitleChange && title !== documentTitle) {
      onTitleChange(title);
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
      let result;
      let savedDocument: Document | null = null;

      if (user) {
        const { data: existingDocs } = await supabase
          .from('documents')
          .select('id')
          .eq('owner_id', user.id)
          .eq('title', title || titlePlaceholder)
          .limit(1);
        
        if (existingDocs && existingDocs.length > 0) {
          const { data, error } = await supabase
            .from('documents')
            .update({ 
              content: content,
              title: title || titlePlaceholder,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingDocs[0].id)
            .select('id, title, content, updated_at')
            .single();
          
          if (error) throw new Error(error.message);
          savedDocument = data;
        } else {
          const { data, error } = await supabase
            .from('documents')
            .insert({
              content: content,
              owner_id: user.id,
              title: title || titlePlaceholder
            })
            .select('id, title, content, updated_at')
            .single();
          
          if (error) throw new Error(error.message);
          savedDocument = data;
        }

        fetchUserDocuments();
      } else {
        const newDoc: Document = {
          id: Date.now().toString(),
          title: title || titlePlaceholder,
          content: content || '',
          updated_at: new Date().toISOString()
        };
        
        localStorage.setItem('guestDocument', JSON.stringify({
          content: content,
          title: title || titlePlaceholder,
          updated_at: new Date().toISOString()
        }));
        
        let guestDocs: Document[] = [];
        const storedDocs = localStorage.getItem('guestDocuments');
        
        if (storedDocs) {
          guestDocs = JSON.parse(storedDocs);
          const existingIndex = guestDocs.findIndex(doc => doc.title === (title || titlePlaceholder));
          
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
          <h1 className="text-lg font-medium text-editor-heading">
            {title || titlePlaceholder}
          </h1>
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
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleCloseDocument}
          title="Close document"
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
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

      <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Do you want to save before closing this document?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCloseDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCloseWithoutSaving} className="bg-destructive text-destructive-foreground">Discard Changes</AlertDialogAction>
            <AlertDialogAction onClick={handleSaveAndClose}>Save & Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
};
