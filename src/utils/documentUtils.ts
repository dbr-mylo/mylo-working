
import { supabase } from "@/integrations/supabase/client";
import type { Document } from "@/lib/types";

export const fetchUserDocumentsFromSupabase = async (userId: string): Promise<Document[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('id, title, content, updated_at')
    .eq('owner_id', userId)
    .order('updated_at', { ascending: false });
    
  if (error) throw error;
  
  return data || [];
};

export const deleteDocumentFromSupabase = async (documentId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId)
    .eq('owner_id', userId);
    
  if (error) throw error;
};

export const fetchGuestDocumentsFromLocalStorage = (): Document[] => {
  try {
    console.log("Fetching guest documents from localStorage");
    const localDocs = localStorage.getItem('guestDocuments');
    console.log("Raw localStorage data:", localDocs);
    
    if (!localDocs) {
      console.log("No documents found in localStorage");
      return [];
    }
    
    try {
      const parsedDocs = JSON.parse(localDocs);
      console.log("Parsed localStorage documents:", parsedDocs);
      
      // Check if parsedDocs is an array
      if (!Array.isArray(parsedDocs)) {
        console.warn("localStorage 'guestDocuments' is not an array:", parsedDocs);
        return [];
      }
      
      // Validate and ensure each document conforms to the Document type
      const validDocuments: Document[] = [];
      
      parsedDocs.forEach((item: any, index: number) => {
        console.log(`Checking document ${index}:`, item);
        
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
        } else {
          console.warn(`Document at index ${index} is invalid:`, item);
        }
      });
      
      console.log("Valid documents found:", validDocuments.length);
      
      // Deduplicate by ID
      const uniqueDocs = Array.from(
        new Map(validDocuments.map(item => [item.id, item])).values()
      );
      
      console.log("Unique documents to return:", uniqueDocs.length);
      return uniqueDocs;
    } catch (parseError) {
      console.error("Error parsing JSON from localStorage:", parseError);
      
      // Attempt to fix corrupted JSON if possible
      if (localDocs) {
        try {
          // Try to initialize localStorage with an empty array if parsing failed
          localStorage.setItem('guestDocuments', JSON.stringify([]));
          console.log("Reset guestDocuments in localStorage to empty array");
        } catch (resetError) {
          console.error("Failed to reset localStorage:", resetError);
        }
      }
      
      return [];
    }
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return [];
  }
};

export const deleteDocumentFromLocalStorage = (documentId: string): Document[] => {
  try {
    console.log("Deleting document from localStorage:", documentId);
    const localDocs = localStorage.getItem('guestDocuments');
    if (!localDocs) return [];
    
    const docs = JSON.parse(localDocs);
    const updatedDocs = docs.filter((doc: Document) => doc.id !== documentId);
    localStorage.setItem('guestDocuments', JSON.stringify(updatedDocs));
    
    console.log("Updated documents after deletion:", updatedDocs.length);
    return updatedDocs;
  } catch (error) {
    console.error("Error deleting local document:", error);
    throw error;
  }
};

export const deduplicateDocuments = (documents: Document[]): Document[] => {
  const uniqueDocuments = Array.from(
    new Map(documents.map(item => [item.id, item])).values()
  );
  return uniqueDocuments;
};
