
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

export const fetchGuestDocumentsFromLocalStorage = (role: string): Document[] => {
  try {
    console.log(`Fetching guest documents from localStorage for role: ${role}`);
    
    // Safely check if localStorage is available in this context
    if (typeof localStorage === 'undefined') {
      console.warn("localStorage is not available in this context");
      return [];
    }
    
    const storageKey = `${role}Documents`;
    const localDocs = localStorage.getItem(storageKey);
    console.log(`Raw localStorage data for ${role}:`, localDocs);
    
    if (!localDocs) {
      console.log(`No documents found in localStorage for ${role}`);
      return [];
    }
    
    try {
      const parsedDocs = JSON.parse(localDocs);
      console.log(`Parsed localStorage documents for ${role}:`, parsedDocs);
      
      // Check if parsedDocs is an array
      if (!Array.isArray(parsedDocs)) {
        console.warn(`localStorage '${storageKey}' is not an array:`, parsedDocs);
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
      
      console.log(`Valid documents found for ${role}:`, validDocuments.length);
      
      // Deduplicate by ID
      const uniqueDocs = Array.from(
        new Map(validDocuments.map(item => [item.id, item])).values()
      );
      
      console.log(`Unique documents to return for ${role}:`, uniqueDocs.length);
      return uniqueDocs.length > 0 ? uniqueDocs : [];
    } catch (parseError) {
      console.error(`Error parsing JSON from localStorage for ${role}:`, parseError);
      
      // Attempt to fix corrupted JSON if possible
      if (localDocs) {
        try {
          // Try to initialize localStorage with an empty array if parsing failed
          localStorage.setItem(storageKey, JSON.stringify([]));
          console.log(`Reset ${storageKey} in localStorage to empty array`);
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

export const deleteDocumentFromLocalStorage = (documentId: string, role: string): Document[] => {
  try {
    console.log(`Deleting document from localStorage for role ${role}:`, documentId);
    const storageKey = `${role}Documents`;
    const localDocs = localStorage.getItem(storageKey);
    if (!localDocs) return [];
    
    const docs = JSON.parse(localDocs);
    const updatedDocs = docs.filter((doc: Document) => doc.id !== documentId);
    localStorage.setItem(storageKey, JSON.stringify(updatedDocs));
    
    console.log(`Updated documents after deletion for ${role}:`, updatedDocs.length);
    return updatedDocs;
  } catch (error) {
    console.error(`Error deleting local document for ${role}:`, error);
    throw error;
  }
};

export const deduplicateDocuments = (documents: Document[]): Document[] => {
  const uniqueDocuments = Array.from(
    new Map(documents.map(item => [item.id, item])).values()
  );
  return uniqueDocuments;
};
