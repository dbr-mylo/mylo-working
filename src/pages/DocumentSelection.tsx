import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Document } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useWindowSize } from "@/hooks/useWindowSize";

const DocumentSelection = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
          setDocuments(data);
        }
      } else if (role) {
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

  return (
    <div className="min-h-screen bg-editor-bg p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-editor-heading mb-2">Your Documents</h1>
          <p className="text-editor-text">Select a document to edit or create a new one</p>
        </header>
        
        <div className="mb-6 flex justify-start">
          <Button 
            onClick={handleCreateNewDocument}
            className="text-base"
          >
            Create New
          </Button>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)` }}>
          {isLoading ? (
            <p className="text-editor-text text-center py-12 col-span-full">Loading your documents...</p>
          ) : documents.length === 0 ? (
            <p className="text-editor-text text-center py-12 col-span-full">No documents found. Create your first document!</p>
          ) : (
            documents.map((doc) => (
              <Card 
                key={doc.id} 
                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleOpenDocument(doc.id)}
              >
                <CardHeader className="p-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-md truncate">{doc.title}</CardTitle>
                    <div className="flex items-center text-md text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDate(doc.updated_at)}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentSelection;
