
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
    console.log("Content preview:", content.substring(0, 100));
    
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
      
      console.log("Document updated in Supabase:", data?.id);
      console.log("Retrieved content length:", data?.content?.length || 0);
      
      savedDocument = data;
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
      
      console.log("Document created in Supabase:", data?.id);
      console.log("Saved content length:", data?.content?.length || 0);
      
      savedDocument = data;
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
    console.log("Content preview:", content.substring(0, 100));
    
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
        docs[existingIndex] = {
          ...docs[existingIndex],
          title: docTitle,
          content: content,
          updated_at: new Date().toISOString()
        };
        
        localStorage.setItem('guestDocuments', JSON.stringify(docs));
        savedDocument = docs[existingIndex];
        console.log("Updated document in localStorage:", savedDocument?.id);
        console.log("Saved content length:", savedDocument?.content?.length || 0);
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
        console.log("Saved content length:", savedDocument?.content?.length || 0);
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
      console.log("Saved content length:", savedDocument?.content?.length || 0);
    }
    
    return savedDocument;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    throw error;
  }
}
