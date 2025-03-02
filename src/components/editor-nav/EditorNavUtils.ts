
import { Document } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

export const fetchUserDocuments = async (userId: string | undefined, role: string | null = null): Promise<Document[]> => {
  if (!userId) {
    return loadLocalDocuments(role);
  }
  
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('id, title, content, updated_at')
      .eq('owner_id', userId)
      .order('updated_at', { ascending: false });
      
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
