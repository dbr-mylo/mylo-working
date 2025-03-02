
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Document } from "@/lib/types";

export async function fetchDocumentFromSupabase(id: string, userId: string, toast: ReturnType<typeof useToast>["toast"]) {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('id, content, title, updated_at')
      .eq('id', id)
      .eq('owner_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        toast({
          title: "Document not found",
          description: "This document doesn't exist or you don't have access to it.",
          variant: "destructive",
        });
        return null;
      }
      throw error;
    }
    
    if (data) {
      console.log("Loaded document from Supabase:", data);
      
      toast({
        title: "Document loaded",
        description: "Your document has been loaded.",
      });
      
      return data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching document from Supabase:", error);
    throw error;
  }
}

export function fetchDocumentFromLocalStorage(id: string, toast: ReturnType<typeof useToast>["toast"]) {
  try {
    const localDocs = localStorage.getItem('guestDocuments');
    if (localDocs) {
      const parsedDocs = JSON.parse(localDocs);
      const doc = parsedDocs.find((d: Document) => d.id === id);
      
      if (doc) {
        console.log("Loaded document from localStorage:", doc);
        
        toast({
          title: "Document loaded",
          description: "Your local document has been loaded.",
        });
        
        return doc;
      } else {
        toast({
          title: "Document not found",
          description: "This document doesn't exist in your local storage.",
          variant: "destructive",
        });
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error("Error loading local document:", error);
    throw error;
  }
}
