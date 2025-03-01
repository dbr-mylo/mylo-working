
import { Document } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

export const fetchUserDocuments = async (userId: string | undefined): Promise<Document[]> => {
  if (!userId) {
    return loadLocalDocuments();
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

export const loadLocalDocuments = (): Document[] => {
  try {
    const localDocs = localStorage.getItem('guestDocuments');
    if (localDocs) {
      return JSON.parse(localDocs);
    }
  } catch (error) {
    console.error("Error loading local documents:", error);
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
