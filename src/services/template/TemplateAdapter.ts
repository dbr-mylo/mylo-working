
import { supabase } from "@/integrations/supabase/client";
import { Template } from "@/lib/types";

/**
 * Adapter for Supabase template operations
 * Handles all direct database interactions
 */
export class TemplateAdapter {
  /**
   * Fetches all templates from Supabase
   */
  async fetchAllTemplates(timeoutMs = 5000): Promise<Template[]> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Template fetch timeout')), timeoutMs);
    });
    
    const fetchPromise = supabase
      .from('design_templates')
      .select('*')
      .order('updated_at', { ascending: false });
    
    const { data, error } = await Promise.race([fetchPromise, timeoutPromise])
      .then(result => result as typeof fetchPromise extends Promise<infer T> ? T : never)
      .catch(err => {
        console.error("Template fetch error or timeout:", err);
        throw err;
      });

    if (error) {
      throw error;
    }
    
    return data as Template[];
  }

  /**
   * Fetches a specific template by ID
   */
  async fetchTemplateById(id: string, timeoutMs = 5000): Promise<Template | null> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Template fetch timeout')), timeoutMs);
    });
    
    const fetchPromise = supabase
      .from('design_templates')
      .select('*')
      .eq('id', id)
      .single();
    
    const { data, error } = await Promise.race([fetchPromise, timeoutPromise])
      .then(result => result as typeof fetchPromise extends Promise<infer T> ? T : never)
      .catch(err => {
        console.error("Template fetch error or timeout:", err);
        return { data: null, error: err };
      });

    if (error) {
      if (error.code === 'PGRST116') {
        // Template not found
        return null;
      }
      throw error;
    }
    
    return data as Template;
  }

  /**
   * Creates a new template in Supabase
   */
  async createTemplate(template: Omit<Template, 'id'>): Promise<Template> {
    const { data, error } = await supabase
      .from('design_templates')
      .insert({
        name: template.name,
        styles: template.styles,
        status: template.status || 'draft',
        category: template.category,
        version: template.version || 1
      })
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    return data as Template;
  }

  /**
   * Updates an existing template in Supabase
   */
  async updateTemplate(id: string, updates: Partial<Template>): Promise<Template> {
    const { data, error } = await supabase
      .from('design_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    return data as Template;
  }

  /**
   * Deletes a template from Supabase
   */
  async deleteTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('design_templates')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }
  
  /**
   * Check if user is authenticated with Supabase
   */
  isAuthenticated(): boolean {
    return !!supabase.auth.getSession();
  }
}

export const templateAdapter = new TemplateAdapter();
