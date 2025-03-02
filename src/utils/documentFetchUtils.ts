
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Document } from "@/lib/types";

/**
 * Fetches a document from Supabase for an authenticated user
 * @param id Document ID
 * @param userId User ID
 * @param toast Toast notification function
 * @returns Document object or null if not found
 */
export async function fetchDocumentFromSupabase(
  id: string, 
  userId: string, 
  toast: ReturnType<typeof useToast>["toast"]
): Promise<Document | null> {
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
    
    if (!data) return null;
    
    console.log("Loaded document from Supabase:", data);
    console.log("Content from Supabase:", data.content ? data.content.substring(0, 100) : "empty");
    
    toast({
      title: "Document loaded",
      description: "Your document has been loaded.",
    });
    
    return data;
  } catch (error) {
    console.error("Error fetching document from Supabase:", error);
    throw error;
  }
}

/**
 * Fetches a document from localStorage for a guest user
 * @param id Document ID
 * @param toast Toast notification function
 * @returns Document object or null if not found
 */
export function fetchDocumentFromLocalStorage(
  id: string, 
  toast: ReturnType<typeof useToast>["toast"]
): Document | null {
  try {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      console.warn("localStorage is not available in this context");
      throw new Error("localStorage is not available");
    }

    const localDocs = localStorage.getItem('guestDocuments');
    if (!localDocs) {
      console.warn("No documents found in localStorage");
      return null;
    }
    
    const parsedDocs = JSON.parse(localDocs);
    console.log("All localStorage documents:", parsedDocs);
    
    if (!Array.isArray(parsedDocs)) {
      console.warn("localStorage documents is not an array:", parsedDocs);
      return null;
    }
    
    const doc = parsedDocs.find((d: Document) => d.id === id);
    
    if (!doc) {
      console.warn("Document not found in localStorage. ID:", id);
      console.log("Available document IDs:", parsedDocs.map((d: Document) => d.id));
      
      toast({
        title: "Document not found",
        description: "This document doesn't exist in your local storage.",
        variant: "destructive",
      });
      return null;
    }
    
    console.log("Found document in localStorage:", doc);
    console.log("Document content from localStorage:", doc.content ? doc.content.substring(0, 100) : "empty");
    
    // Ensure content is a string
    const safeDoc = ensureDocumentContentIsString(doc);
    
    toast({
      title: "Document loaded",
      description: "Your local document has been loaded.",
    });
    
    return safeDoc;
  } catch (error) {
    console.error("Error loading local document:", error);
    throw error;
  }
}

/**
 * Ensures document content is a string
 * @param doc Document object
 * @returns Document with string content
 */
function ensureDocumentContentIsString(doc: Document): Document {
  if (!doc.content) {
    return { ...doc, content: "" };
  }
  
  if (typeof doc.content === 'string') {
    return doc;
  }
  
  // Convert object content to string
  return { 
    ...doc, 
    content: JSON.stringify(doc.content) 
  };
}

/**
 * Prepares a document for loading into the editor
 * @param doc Document object
 * @returns Processed document ready for editor
 */
export function loadDocument(doc: Document) {
  // First ensure document content is a string
  const safeDoc = ensureDocumentContentIsString(doc);
  const docContent = safeDoc.content || "";
  
  console.log("Loading document content:", docContent ? docContent.substring(0, 50) + "..." : "empty");
  
  return {
    content: docContent,
    initialContent: docContent,
    documentTitle: doc.title || "",
    currentDocumentId: doc.id
  };
}
