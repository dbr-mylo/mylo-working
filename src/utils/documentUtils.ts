
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
    const localDocs = localStorage.getItem('guestDocuments');
    if (!localDocs) return [];
    
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
    
    return uniqueDocs;
  } catch (error) {
    console.error("Error loading local documents:", error);
    return [];
  }
};

export const deleteDocumentFromLocalStorage = (documentId: string): Document[] => {
  try {
    const localDocs = localStorage.getItem('guestDocuments');
    if (!localDocs) return [];
    
    const docs = JSON.parse(localDocs);
    const updatedDocs = docs.filter((doc: Document) => doc.id !== documentId);
    localStorage.setItem('guestDocuments', JSON.stringify(updatedDocs));
    
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
