
import { Document } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

export const fetchUserDocuments = async (userId: string | undefined, role: string | undefined): Promise<Document[]> => {
  console.log(`Fetching documents for userId: ${userId} with role: ${role}`);
  
  if (!userId) {
    console.log(`Loading local documents for role: ${role}`);
    return loadLocalDocuments(role);
  }
  
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('id, title, content, updated_at')
      .eq('owner_id', userId)
      .order('updated_at', { ascending: false });
      
    if (error) throw error;
    
    console.log(`Fetched ${data?.length || 0} documents from Supabase`);
    return data || [];
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

export const loadLocalDocuments = (role: string | undefined): Document[] => {
  try {
    console.log(`Loading local documents for role: ${role}`);
    const storageKey = `${role}Documents`;
    const localDocs = localStorage.getItem(storageKey);
    console.log(`Raw localStorage data for ${role}:`, localDocs);
    
    if (localDocs) {
      const docs = JSON.parse(localDocs);
      console.log(`Parsed ${docs.length} documents from localStorage for ${role}`);
      return docs;
    }
  } catch (error) {
    console.error(`Error loading local documents for ${role}:`, error);
  }
  console.log(`No documents found in localStorage for ${role}`);
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
