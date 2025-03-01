
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Document } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, Clock } from "lucide-react";

const DocumentSelection = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, role } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDocuments();
  }, [user]);

  const fetchUserDocuments = async () => {
    setIsLoading(true);
    try {
      if (user) {
        // Fetch documents from Supabase for authenticated users
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

  return (
    <div className="min-h-screen bg-editor-bg p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-editor-heading mb-2">Your Documents</h1>
          <p className="text-editor-text">Select a document to edit or create a new one</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New Document Card */}
          <Card className="border-2 border-dashed border-gray-300 hover:border-primary hover:bg-gray-50 transition-colors cursor-pointer flex flex-col items-center justify-center h-64">
            <CardContent className="flex flex-col items-center justify-center h-full pt-6 pb-0">
              <Button 
                variant="ghost" 
                size="lg"
                className="w-16 h-16 rounded-full"
                onClick={handleCreateNewDocument}
              >
                <Plus className="h-8 w-8" />
              </Button>
              <CardTitle className="mt-4 text-xl">Create New Document</CardTitle>
            </CardContent>
          </Card>

          {/* Document Cards */}
          {isLoading ? (
            <p className="text-editor-text col-span-3 text-center py-12">Loading your documents...</p>
          ) : documents.length === 0 ? (
            <p className="text-editor-text col-span-3 text-center py-12">No documents found. Create your first document!</p>
          ) : (
            documents.map((doc) => (
              <Card 
                key={doc.id} 
                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-64 flex flex-col"
                onClick={() => handleOpenDocument(doc.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <FileText className="h-6 w-6 text-editor-text mb-2" />
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(doc.updated_at)}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{doc.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-0 flex-grow flex items-center justify-center">
                  <div className="text-sm text-gray-400 italic">
                    Click to edit this document
                  </div>
                </CardContent>
                <CardFooter className="pt-2 pb-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDocument(doc.id);
                    }}
                  >
                    Open Document
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentSelection;
