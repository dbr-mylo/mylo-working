import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Document } from "@/lib/types";

export function useDocument(documentId: string | undefined) {
  const [content, setContent] = useState("");
  const [initialContent, setInitialContent] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, role } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (documentId) {
      fetchDocument(documentId);
    } else {
      setContent("");
      setInitialContent("");
      setDocumentTitle("");
      setCurrentDocumentId(null);
      setIsLoading(false);
    }
  }, [documentId, user]);

  const fetchDocument = async (id: string) => {
    setIsLoading(true);
    try {
      if (user) {
        const { data, error } = await supabase
          .from('documents')
          .select('id, content, title, updated_at')
          .eq('id', id)
          .eq('owner_id', user.id)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            toast({
              title: "Document not found",
              description: "This document doesn't exist or you don't have access to it.",
              variant: "destructive",
            });
            navigate('/');
            return;
          }
          throw error;
        }
        
        if (data) {
          console.log("Loaded document from Supabase:", data);
          if (data.content) {
            setContent(data.content);
            setInitialContent(data.content);
          } else {
            setContent("");
            setInitialContent("");
          }
          if (data.title) {
            setDocumentTitle(data.title);
          }
          setCurrentDocumentId(data.id);
          
          toast({
            title: "Document loaded",
            description: "Your document has been loaded.",
          });
        }
      } else if (role) {
        try {
          const localDocs = localStorage.getItem('guestDocuments');
          if (localDocs) {
            const parsedDocs = JSON.parse(localDocs);
            const doc = parsedDocs.find((d: Document) => d.id === id);
            
            if (doc) {
              console.log("Loaded document from localStorage:", doc);
              setContent(doc.content || "");
              setInitialContent(doc.content || "");
              setDocumentTitle(doc.title || "");
              setCurrentDocumentId(doc.id);
              
              toast({
                title: "Document loaded",
                description: "Your local document has been loaded.",
              });
            } else {
              toast({
                title: "Document not found",
                description: "This document doesn't exist in your local storage.",
                variant: "destructive",
              });
              navigate('/');
            }
          }
        } catch (error) {
          console.error("Error loading local document:", error);
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      toast({
        title: "Error loading document",
        description: "There was a problem loading your document.",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const saveDocument = async (): Promise<void> => {
    try {
      console.log("Saving document with content:", content);
      
      if (!content || !content.trim()) {
        toast({
          title: "Cannot save empty document",
          description: "Please add some content to your document before saving.",
          variant: "destructive",
        });
        return;
      }
      
      let savedDocument: Document | null = null;
      
      if (user) {
        if (currentDocumentId) {
          const { data, error } = await supabase
            .from('documents')
            .update({ 
              content: content,
              title: documentTitle || "Untitled Document",
              updated_at: new Date().toISOString()
            })
            .eq('id', currentDocumentId)
            .eq('owner_id', user.id)
            .select('id, title, content, updated_at')
            .single();
          
          if (error) throw error;
          savedDocument = data;
          console.log("Updated document in Supabase:", data);
        } else {
          const { data, error } = await supabase
            .from('documents')
            .insert({
              content: content,
              owner_id: user.id,
              title: documentTitle || "Untitled Document"
            })
            .select('id, title, content, updated_at')
            .single();
          
          if (error) throw error;
          savedDocument = data;
          console.log("Created document in Supabase:", data);
          
          if (data && data.id) {
            setCurrentDocumentId(data.id);
            navigate(`/editor/${data.id}`, { replace: true });
          }
        }
      } else if (role) {
        try {
          const docTitle = documentTitle || "Untitled Document";
          
          if (currentDocumentId) {
            const localDocs = localStorage.getItem('guestDocuments');
            let docs = localDocs ? JSON.parse(localDocs) : [];
            
            if (!Array.isArray(docs)) {
              docs = [];
            }
            
            const existingIndex = docs.findIndex((doc: Document) => doc.id === currentDocumentId);
            
            if (existingIndex >= 0) {
              docs[existingIndex] = {
                ...docs[existingIndex],
                title: docTitle,
                content: content,
                updated_at: new Date().toISOString()
              };
              
              if (typeof docs[existingIndex].content !== 'string') {
                docs[existingIndex].content = String(docs[existingIndex].content || "");
              }
              
              localStorage.setItem('guestDocuments', JSON.stringify(docs));
              savedDocument = docs[existingIndex];
              console.log("Updated document in localStorage:", savedDocument);
            } else {
              const newDoc: Document = {
                id: currentDocumentId,
                title: docTitle,
                content: content,
                updated_at: new Date().toISOString()
              };
              
              docs.unshift(newDoc);
              localStorage.setItem('guestDocuments', JSON.stringify(docs));
              savedDocument = newDoc;
              console.log("Created new document in localStorage with existing ID:", savedDocument);
            }
          } else {
            const newDoc: Document = {
              id: Date.now().toString(),
              title: docTitle,
              content: content,
              updated_at: new Date().toISOString()
            };
            
            setCurrentDocumentId(newDoc.id);
            navigate(`/editor/${newDoc.id}`, { replace: true });
            
            let guestDocs: Document[] = [];
            const storedDocs = localStorage.getItem('guestDocuments');
            
            if (storedDocs) {
              try {
                const parsed = JSON.parse(storedDocs);
                guestDocs = Array.isArray(parsed) ? parsed : [];
              } catch (e) {
                console.error("Error parsing stored docs:", e);
                guestDocs = [];
              }
            }
            
            guestDocs.unshift(newDoc);
            localStorage.setItem('guestDocuments', JSON.stringify(guestDocs));
            savedDocument = newDoc;
          }
        } catch (error) {
          console.error("Error saving to localStorage:", error);
          throw error;
        }
      } else {
        toast({
          title: "Authentication required",
          description: "Please log in or continue as a guest to save documents.",
          variant: "destructive",
        });
        return;
      }
      
      setInitialContent(content);
      
      toast({
        title: "Document saved",
        description: "Your changes have been saved successfully.",
      });
      
      console.log("Document saved successfully", savedDocument);
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        title: "Error saving document",
        description: "There was a problem saving your document.",
        variant: "destructive",
      });
    }
  };

  const loadDocument = (doc: Document) => {
    const docContent = typeof doc.content === 'string' ? doc.content : String(doc.content || "");
    
    setContent(docContent);
    setInitialContent(docContent);
    setDocumentTitle(doc.title || "");
    setCurrentDocumentId(doc.id);
  };

  return {
    content,
    setContent,
    initialContent,
    documentTitle,
    setDocumentTitle,
    currentDocumentId,
    isLoading,
    saveDocument,
    loadDocument
  };
}
