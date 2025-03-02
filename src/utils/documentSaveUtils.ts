
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Document } from "@/lib/types";

export async function saveDocumentToSupabase(
  documentId: string | null, 
  content: string, 
  title: string, 
  userId: string,
  toast: ReturnType<typeof useToast>["toast"]
): Promise<Document | null> {
  try {
    console.log("Saving to Supabase. Content length:", content.length);
    
    let savedDocument: Document | null = null;
    
    if (documentId) {
      // Update existing document
      const { data, error } = await supabase
        .from('documents')
        .update({ 
          content: content,
          title: title || "Untitled Document",
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId)
        .eq('owner_id', userId)
        .select('id, title, content, updated_at')
        .single();
      
      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }
      savedDocument = data;
      console.log("Updated document in Supabase:", data?.id);
    } else {
      // Create new document
      const { data, error } = await supabase
        .from('documents')
        .insert({
          content: content,
          owner_id: userId,
          title: title || "Untitled Document"
        })
        .select('id, title, content, updated_at')
        .single();
      
      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }
      savedDocument = data;
      console.log("Created document in Supabase:", data?.id);
    }
    
    return savedDocument;
  } catch (error) {
    console.error("Error saving document to Supabase:", error);
    throw error;
  }
}

export function saveDocumentToLocalStorage(
  documentId: string | null, 
  content: string, 
  title: string,
  toast: ReturnType<typeof useToast>["toast"]
): Document | null {
  try {
    console.log("Saving to localStorage. Content length:", content.length);
    
    const docTitle = title || "Untitled Document";
    let savedDocument: Document | null = null;
    
    if (documentId) {
      // Update existing document
      const localDocs = localStorage.getItem('guestDocuments');
      let docs = localDocs ? JSON.parse(localDocs) : [];
      
      if (!Array.isArray(docs)) {
        docs = [];
      }
      
      const existingIndex = docs.findIndex((doc: Document) => doc.id === documentId);
      
      if (existingIndex >= 0) {
        // Make sure to properly stringify content if it's an object
        const sanitizedContent = typeof content === 'object' ? JSON.stringify(content) : content;
        
        docs[existingIndex] = {
          ...docs[existingIndex],
          title: docTitle,
          content: sanitizedContent,
          updated_at: new Date().toISOString()
        };
        
        localStorage.setItem('guestDocuments', JSON.stringify(docs));
        savedDocument = docs[existingIndex];
        console.log("Updated document in localStorage:", savedDocument?.id);
      } else {
        // Document with ID not found, create new
        const newDoc: Document = {
          id: documentId,
          title: docTitle,
          content: content,
          updated_at: new Date().toISOString()
        };
        
        docs.unshift(newDoc);
        localStorage.setItem('guestDocuments', JSON.stringify(docs));
        savedDocument = newDoc;
        console.log("Created new document in localStorage with existing ID:", savedDocument?.id);
      }
    } else {
      // Create new document
      const newDoc: Document = {
        id: Date.now().toString(),
        title: docTitle,
        content: content,
        updated_at: new Date().toISOString()
      };
      
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
      console.log("Created new document in localStorage:", savedDocument?.id);
    }
    
    return savedDocument;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    throw error;
  }
}
