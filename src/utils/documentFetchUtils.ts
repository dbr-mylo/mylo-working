
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Document } from "@/lib/types";

export async function fetchDocumentFromSupabase(id: string, userId: string, toast: ReturnType<typeof useToast>["toast"]) {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('id, content, title, updated_at')
      .eq('id', id)
      .eq('owner_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        toast({
          title: "Document not found",
          description: "This document doesn't exist or you don't have access to it.",
          variant: "destructive",
        });
        return null;
      }
      throw error;
    }
    
    if (data) {
      console.log("Loaded document from Supabase:", data);
      console.log("Content from Supabase:", data.content ? data.content.substring(0, 100) : "empty");
      
      toast({
        title: "Document loaded",
        description: "Your document has been loaded.",
      });
      
      return data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching document from Supabase:", error);
    throw error;
  }
}

export function fetchDocumentFromLocalStorage(id: string, role: string, toast: ReturnType<typeof useToast>["toast"]) {
  try {
    const storageKey = role === 'designer' ? 'designerDocuments' : 'editorDocuments';
    const localDocs = localStorage.getItem(storageKey);
    if (localDocs) {
      const parsedDocs = JSON.parse(localDocs);
      console.log(`All localStorage ${role} documents:`, parsedDocs);
      
      if (!Array.isArray(parsedDocs)) {
        console.warn(`localStorage ${role} documents is not an array:`, parsedDocs);
        return null;
      }
      
      const doc = parsedDocs.find((d: Document) => d.id === id);
      
      if (doc) {
        console.log(`Found ${role} document in localStorage:`, doc);
        console.log(`Document content from localStorage:`, doc.content ? doc.content.substring(0, 100) : "empty");
        
        // Ensure content is a string
        if (doc.content && typeof doc.content === 'object') {
          doc.content = JSON.stringify(doc.content);
        } else if (doc.content === null || doc.content === undefined) {
          doc.content = "";
        }
        
        toast({
          title: "Document loaded",
          description: "Your local document has been loaded.",
        });
        
        return doc;
      } else {
        console.warn(`Document not found in localStorage. ID: ${id}`);
        console.log("Available document IDs:", parsedDocs.map((d: Document) => d.id));
        
        toast({
          title: "Document not found",
          description: "This document doesn't exist in your local storage.",
          variant: "destructive",
        });
        return null;
      }
    } else {
      console.warn(`No ${role} documents found in localStorage`);
    }
    return null;
  } catch (error) {
    console.error(`Error loading local ${role} document:`, error);
    throw error;
  }
}

export function loadDocument(doc: Document) {
  // Make sure content is always a string
  let docContent = "";
  
  if (doc.content) {
    if (typeof doc.content === 'string') {
      docContent = doc.content;
    } else {
      // If not a string, convert to string (e.g., if it's an object)
      docContent = JSON.stringify(doc.content);
    }
  }
  
  console.log("Loading document content:", docContent ? docContent.substring(0, 50) + "..." : "empty");
  
  return {
    content: docContent,
    initialContent: docContent,
    documentTitle: doc.title || "",
    currentDocumentId: doc.id
  };
}
