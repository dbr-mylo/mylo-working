
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Document } from "@/lib/types";

/**
 * Saves a document to Supabase for an authenticated user
 * @param documentId Document ID (null for new document)
 * @param content Document content
 * @param title Document title
 * @param userId User ID
 * @param toast Toast notification function
 * @returns Saved document or null if failed
 */
export async function saveDocumentToSupabase(
  documentId: string | null, 
  content: string, 
  title: string, 
  userId: string,
  toast: ReturnType<typeof useToast>["toast"]
): Promise<Document | null> {
  try {
    if (!content || !content.trim()) {
      throw new Error("Cannot save empty document");
    }
    
    console.log("Saving to Supabase. Content length:", content ? content.length : 0);
    console.log("Content preview:", content ? content.substring(0, 100) : "empty");
    
    if (documentId) {
      return await updateExistingDocumentInSupabase(documentId, content, title, userId);
    } else {
      return await createNewDocumentInSupabase(content, title, userId);
    }
  } catch (error) {
    console.error("Error saving document to Supabase:", error);
    throw error;
  }
}

/**
 * Updates an existing document in Supabase
 * @param documentId Document ID
 * @param content Document content
 * @param title Document title
 * @param userId User ID
 * @returns Updated document or null if failed
 */
async function updateExistingDocumentInSupabase(
  documentId: string, 
  content: string, 
  title: string, 
  userId: string
): Promise<Document | null> {
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
  console.log("Content preview from update:", data?.content ? data.content.substring(0, 100) : "empty");
  
  return data;
}

/**
 * Creates a new document in Supabase
 * @param content Document content
 * @param title Document title
 * @param userId User ID
 * @returns Created document or null if failed
 */
async function createNewDocumentInSupabase(
  content: string, 
  title: string, 
  userId: string
): Promise<Document | null> {
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
  console.log("Content preview from create:", data?.content ? data.content.substring(0, 100) : "empty");
  
  return data;
}

/**
 * Saves a document to localStorage for a guest user
 * @param documentId Document ID (null for new document)
 * @param content Document content
 * @param title Document title
 * @param toast Toast notification function
 * @returns Saved document or null if failed
 */
export function saveDocumentToLocalStorage(
  documentId: string | null, 
  content: string, 
  title: string,
  toast: ReturnType<typeof useToast>["toast"]
): Document | null {
  try {
    if (!content || !content.trim()) {
      throw new Error("Cannot save empty document");
    }
    
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      console.warn("localStorage is not available in this context");
      throw new Error("localStorage is not available");
    }
    
    console.log("Saving to localStorage. Content length:", content ? content.length : 0);
    console.log("Content preview:", content ? content.substring(0, 100) : "empty");
    
    const docTitle = title || "Untitled Document";
    
    if (documentId) {
      return updateExistingDocumentInLocalStorage(documentId, content, docTitle);
    } else {
      return createNewDocumentInLocalStorage(content, docTitle);
    }
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    throw error;
  }
}

/**
 * Updates an existing document in localStorage
 * @param documentId Document ID
 * @param content Document content
 * @param title Document title
 * @returns Updated document or null if failed
 */
function updateExistingDocumentInLocalStorage(
  documentId: string, 
  content: string, 
  title: string
): Document | null {
  const localDocs = localStorage.getItem('guestDocuments');
  let docs = localDocs ? JSON.parse(localDocs) : [];
  
  if (!Array.isArray(docs)) {
    docs = [];
  }
  
  const existingIndex = docs.findIndex((doc: Document) => doc.id === documentId);
  let updatedDoc: Document;
  
  if (existingIndex >= 0) {
    // Update existing document
    updatedDoc = {
      ...docs[existingIndex],
      title: title,
      content: content,
      updated_at: new Date().toISOString()
    };
    docs[existingIndex] = updatedDoc;
  } else {
    // Create new document with existing ID
    updatedDoc = {
      id: documentId,
      title: title,
      content: content,
      updated_at: new Date().toISOString()
    };
    docs.unshift(updatedDoc);
  }
  
  // Save to localStorage
  localStorage.setItem('guestDocuments', JSON.stringify(docs));
  
  // Verify the document was saved correctly
  const verifyDocs = JSON.parse(localStorage.getItem('guestDocuments') || '[]');
  const verifyDoc = verifyDocs.find((d: Document) => d.id === documentId);
  console.log("Verification - document after save:", verifyDoc);
  
  return updatedDoc;
}

/**
 * Creates a new document in localStorage
 * @param content Document content
 * @param title Document title
 * @returns Created document or null if failed
 */
function createNewDocumentInLocalStorage(
  content: string, 
  title: string
): Document {
  const newDoc: Document = {
    id: Date.now().toString(),
    title: title,
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
  
  // Verify the document was saved correctly
  const verifyDocs = JSON.parse(localStorage.getItem('guestDocuments') || '[]');
  const verifyDoc = verifyDocs.find((d: Document) => d.id === newDoc.id);
  console.log("Verification - brand new document after save:", verifyDoc);
  
  return newDoc;
}
