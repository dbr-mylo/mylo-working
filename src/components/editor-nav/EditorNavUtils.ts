
import { Document } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

export const fetchUserDocuments = async (userId: string | undefined, role: string | null = null): Promise<Document[]> => {
  if (!userId) {
    return loadLocalDocuments(role);
  }
  
  try {
    let query = supabase
      .from('documents')
      .select('id, title, content, updated_at')
      .eq('owner_id', userId)
      .order('updated_at', { ascending: false });
    
    // Filter by template status for designer role
    if (role === 'designer') {
      query = query.eq('is_template', true);
    } else if (role === 'editor') {
      query = query.eq('is_template', false);
    }
    
    const { data, error } = await query;
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

export const loadLocalDocuments = (role: string | null): Document[] => {
  try {
    const storageKey = role === 'designer' ? 'designerDocuments' : 'editorDocuments';
    const localDocs = localStorage.getItem(storageKey);
    if (localDocs) {
      return JSON.parse(localDocs);
    }
  } catch (error) {
    console.error(`Error loading ${role} documents:`, error);
  }
  return [];
};

export const hasUnsavedChanges = (
  content: string | undefined, 
  initialContent: string | undefined,
  title: string,
  documentTitle: string
): boolean => {
  return (content !== initialContent) || (title !== documentTitle);
};

export const deleteDocument = async (documentId: string, userId: string | undefined, role: string | null): Promise<boolean> => {
  if (!userId) {
    return deleteLocalDocument(documentId, role);
  }
  
  try {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId)
      .eq('owner_id', userId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    return false;
  }
};

export const deleteLocalDocument = (documentId: string, role: string | null): boolean => {
  try {
    const storageKey = role === 'designer' ? 'designerDocuments' : 'editorDocuments';
    const localDocs = localStorage.getItem(storageKey);
    
    if (localDocs) {
      const documents = JSON.parse(localDocs);
      const updatedDocuments = documents.filter((doc: Document) => doc.id !== documentId);
      localStorage.setItem(storageKey, JSON.stringify(updatedDocuments));
      return true;
    }
  } catch (error) {
    console.error(`Error deleting ${role} document:`, error);
  }
  return false;
};

// New function to manage preview visibility preference
export const getPreviewVisibilityPreference = (): boolean => {
  try {
    const preference = localStorage.getItem('designerPreviewVisible');
    return preference ? preference === 'true' : true; // Default to true if not set
  } catch (error) {
    console.error('Error getting preview visibility preference:', error);
    return true; // Default to true on error
  }
};

export const setPreviewVisibilityPreference = (isVisible: boolean): void => {
  try {
    localStorage.setItem('designerPreviewVisible', isVisible.toString());
  } catch (error) {
    console.error('Error setting preview visibility preference:', error);
  }
};
