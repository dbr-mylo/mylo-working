
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import type { Document } from "@/lib/types";

export async function saveDocumentToSupabase(
  documentId: string | null,
  content: string,
  title: string,
  userId: string,
  toast: any,
  isTemplate: boolean = false
): Promise<Document | null> {
  try {
    const now = new Date().toISOString();
    const documentTitle = title.trim() || 'Untitled Document';
    
    // If we have a document ID, update the existing document
    if (documentId) {
      console.log("Updating existing document in Supabase:", documentId);
      
      const { data, error } = await supabase
        .from('documents')
        .update({
          title: documentTitle,
          content: content,
          updated_at: now,
          is_template: isTemplate
        })
        .eq('id', documentId)
        .eq('owner_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      console.log("Document updated in Supabase:", data);
      return data;
    } 
    // Otherwise, create a new document
    else {
      console.log("Creating new document in Supabase");
      
      const { data, error } = await supabase
        .from('documents')
        .insert({
          title: documentTitle,
          content: content,
          owner_id: userId,
          created_at: now,
          updated_at: now,
          is_template: isTemplate
        })
        .select()
        .single();
      
      if (error) throw error;
      
      console.log("New document created in Supabase:", data);
      return data;
    }
  } catch (error) {
    console.error("Error saving document to Supabase:", error);
    toast({
      title: "Error saving document",
      description: "There was a problem saving your document to the server.",
      variant: "destructive",
    });
    return null;
  }
}

export function saveDocumentToLocalStorage(
  documentId: string | null,
  content: string,
  title: string,
  role: string,
  toast: any
): Document | null {
  try {
    const now = new Date().toISOString();
    const documentTitle = title.trim() || 'Untitled Document';
    const storageKey = role === 'designer' ? 'designerDocuments' : 'editorDocuments';
    
    console.log(`Starting localStorage save process for ${role} role`);
    console.log(`Storage key: ${storageKey}, Document ID: ${documentId || 'new'}`);
    
    let documents: Document[] = [];
    const localDocs = localStorage.getItem(storageKey);
    
    if (localDocs) {
      console.log(`Found existing documents in localStorage for ${role} role`);
      documents = JSON.parse(localDocs);
      if (!Array.isArray(documents)) {
        console.warn(`${storageKey} is not an array, resetting to empty array`);
        documents = [];
      }
    } else {
      console.log(`No existing documents found in localStorage for ${role} role`);
    }
    
    let savedDocument: Document;
    
    // If we have a document ID, update the existing document
    if (documentId) {
      console.log(`Updating existing ${role} document in localStorage:`, documentId);
      
      const documentIndex = documents.findIndex(doc => doc.id === documentId);
      
      if (documentIndex !== -1) {
        console.log(`Found document at index ${documentIndex}`);
        savedDocument = {
          ...documents[documentIndex],
          title: documentTitle,
          content: content,
          updated_at: now
        };
        
        documents[documentIndex] = savedDocument;
        console.log(`Updated existing document in array`);
      } else {
        console.warn(`Document with ID ${documentId} not found in ${storageKey}, creating new`);
        
        savedDocument = {
          id: documentId,
          title: documentTitle,
          content: content,
          updated_at: now
        };
        
        documents.push(savedDocument);
        console.log(`Added document with existing ID to array`);
      }
    } 
    // Otherwise, create a new document
    else {
      console.log(`Creating new ${role} document in localStorage`);
      
      const newId = uuidv4();
      console.log(`Generated new UUID: ${newId}`);
      
      savedDocument = {
        id: newId,
        title: documentTitle,
        content: content,
        updated_at: now
      };
      
      documents.push(savedDocument);
      console.log(`Added new document to array`);
    }
    
    console.log(`Saving ${documents.length} documents to localStorage`);
    localStorage.setItem(storageKey, JSON.stringify(documents));
    console.log(`Document saved to ${storageKey}:`, savedDocument.id);
    
    return savedDocument;
  } catch (error) {
    console.error(`Error saving document to ${role} localStorage:`, error);
    toast({
      title: "Error saving document",
      description: "There was a problem saving your document locally.",
      variant: "destructive",
    });
    return null;
  }
}
