
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Document } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Trash2 } from "lucide-react";
import { useWindowSize } from "@/hooks/useWindowSize";
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

const DocumentSelection = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const { user, role } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { width } = useWindowSize();

  useEffect(() => {
    fetchUserDocuments();
  }, [user]);

  const fetchUserDocuments = async () => {
    setIsLoading(true);
    try {
      if (user) {
        const { data, error } = await supabase
          .from('documents')
          .select('id, title, content, updated_at')
          .eq('owner_id', user.id)
          .order('updated_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          // Deduplicate by title if needed
          const uniqueDocuments = Array.from(
            new Map(data.map(item => [item.id, item])).values()
          );
          setDocuments(uniqueDocuments);
        }
      } else if (role) {
        try {
          const localDocs = localStorage.getItem('guestDocuments');
          if (localDocs) {
            const parsedDocs = JSON.parse(localDocs);
            
            // Validate and ensure each document conforms to the Document type
            const validDocuments: Document[] = [];
            
            // Check if parsedDocs is an array
            if (Array.isArray(parsedDocs)) {
              parsedDocs.forEach((item: any) => {
                // Validate that each item has the required Document properties
                if (
                  item && 
                  typeof item === 'object' &&
                  'id' in item && 
                  'title' in item && 
                  'content' in item && 
                  'updated_at' in item
                ) {
                  validDocuments.push({
                    id: String(item.id),
                    title: String(item.title),
                    content: String(item.content),
                    updated_at: String(item.updated_at)
                  });
                }
              });
            }
            
            // Deduplicate by ID
            const uniqueDocs = Array.from(
              new Map(validDocuments.map(item => [item.id, item])).values()
            );
            
            setDocuments(uniqueDocs);
            
            // Also update the localStorage with deduplicated list
            if (uniqueDocs.length !== parsedDocs.length) {
              localStorage.setItem('guestDocuments', JSON.stringify(uniqueDocs));
              toast({
                title: "Duplicate documents removed",
                description: "We've cleaned up some duplicate documents for you.",
              });
            }
          }
        } catch (error) {
          console.error("Error loading local documents:", error);
          setDocuments([]); // Set empty array on error
        }
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error loading documents",
        description: "There was a problem loading your documents.",
        variant: "destructive",
      });
      setDocuments([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewDocument = () => {
    navigate("/editor");
  };

  const handleOpenDocument = (docId: string) => {
    navigate(`/editor/${docId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getGridColumns = () => {
    if (width < 640) return 1;
    if (width < 1024) return 2;
    return 3;
  };

  const confirmDelete = (e: React.MouseEvent, docId: string) => {
    e.stopPropagation();
    setDocumentToDelete(docId);
  };

  const cancelDelete = () => {
    setDocumentToDelete(null);
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;
    
    setIsDeleting(true);
    try {
      if (user) {
        const { error } = await supabase
          .from('documents')
          .delete()
          .eq('id', documentToDelete)
          .eq('owner_id', user.id);
          
        if (error) throw error;
      } else if (role) {
        try {
          const localDocs = localStorage.getItem('guestDocuments');
          if (localDocs) {
            const docs = JSON.parse(localDocs);
            const updatedDocs = docs.filter((doc: Document) => doc.id !== documentToDelete);
            localStorage.setItem('guestDocuments', JSON.stringify(updatedDocs));
            setDocuments(updatedDocs);
          }
        } catch (error) {
          console.error("Error deleting local document:", error);
          throw error;
        }
      }
      
      setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentToDelete));
      
      toast({
        title: "Document deleted",
        description: "Your document has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error deleting document",
        description: "There was a problem deleting your document.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDocumentToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-editor-bg p-8">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-editor-heading mb-2">Your Documents</h1>
          <p className="text-editor-text">Select a document to edit or create a new one</p>
        </header>
        
        <div className="mb-6">
          <Button 
            onClick={handleCreateNewDocument}
            className="text-base"
          >
            Create New
          </Button>
        </div>

        <div className="w-1/2 mx-auto">
          {isLoading ? (
            <p className="text-editor-text text-center py-12">Loading your documents...</p>
          ) : documents.length === 0 ? (
            <p className="text-editor-text text-center py-12">No documents found. Create your first document!</p>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <Card 
                  key={doc.id} 
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer w-full"
                  onClick={() => handleOpenDocument(doc.id)}
                >
                  <CardHeader className="p-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-md truncate">{doc.title}</CardTitle>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center text-md text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDate(doc.updated_at)}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-500 hover:bg-red-100 hover:text-red-600"
                          onClick={(e) => confirmDelete(e, doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={documentToDelete !== null} onOpenChange={cancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your document and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteDocument} 
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DocumentSelection;
