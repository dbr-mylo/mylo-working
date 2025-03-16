
import { supabase } from "@/integrations/supabase/client";
import { Template } from "@/lib/types";
import { toast } from "sonner";
import { TemplateCache } from "./TemplateCache";
import { LocalTemplateStorage } from "./LocalTemplateStorage";

/**
 * Service for managing design templates
 * Provides methods for creating, reading, updating, and deleting templates
 */
class TemplateService {
  private cache: TemplateCache;
  private localStorage: LocalTemplateStorage;

  constructor() {
    this.cache = new TemplateCache();
    this.localStorage = new LocalTemplateStorage();
    
    // Subscribe to auth state changes to clear cache when user signs out
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        this.cache.clearCache();
      }
    });
  }

  /**
   * Gets all templates, with optional forced refresh
   */
  async getTemplates(forceRefresh = false): Promise<Template[]> {
    // Return cached templates if available and not expired
    const cachedTemplates = this.cache.getCachedTemplates();
    if (cachedTemplates && !forceRefresh) {
      console.log("Using cached templates");
      return cachedTemplates;
    }

    try {
      const { data, error } = await supabase
        .from('design_templates')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Update cache
      const templates = data as Template[];
      this.cache.cacheAllTemplates(templates);
      
      return templates;
    } catch (error) {
      console.error("Error fetching templates:", error);
      
      // Try to get from localStorage as fallback for guest users
      if (!supabase.auth.getSession()) {
        return this.localStorage.getLocalTemplates();
      }
      
      throw error;
    }
  }

  /**
   * Gets a template by ID
   */
  async getTemplateById(id: string): Promise<Template | null> {
    // Return from cache if available
    const cachedTemplate = this.cache.getCachedTemplate(id);
    if (cachedTemplate) {
      return cachedTemplate;
    }

    try {
      const { data, error } = await supabase
        .from('design_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Template not found
          return null;
        }
        throw error;
      }

      // Update cache
      const template = data as Template;
      this.cache.cacheTemplate(template);
      return template;
    } catch (error) {
      console.error(`Error fetching template with ID ${id}:`, error);
      
      // Try to get from localStorage as fallback for guest users
      if (!supabase.auth.getSession()) {
        return this.localStorage.getLocalTemplateById(id);
      }
      
      return null;
    }
  }

  /**
   * Creates a new template
   */
  async createTemplate(template: Omit<Template, 'id'>): Promise<Template> {
    try {
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

      // Clear cache to ensure fresh data
      this.cache.clearCache();
      
      const newTemplate = data as Template;
      toast.success(`Template "${newTemplate.name}" created`);
      return newTemplate;
    } catch (error) {
      console.error("Error creating template:", error);
      
      // For guest users, save to localStorage
      if (!supabase.auth.getSession()) {
        return this.localStorage.createLocalTemplate(template);
      }
      
      toast.error("Failed to create template");
      throw error;
    }
  }

  /**
   * Updates an existing template
   */
  async updateTemplate(id: string, updates: Partial<Template>): Promise<Template> {
    try {
      const { data, error } = await supabase
        .from('design_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update cache
      const updatedTemplate = data as Template;
      this.cache.cacheTemplate(updatedTemplate);
      this.cache.invalidateAllTemplates(); // Invalidate the all templates cache
      
      toast.success(`Template "${updatedTemplate.name}" updated`);
      return updatedTemplate;
    } catch (error) {
      console.error(`Error updating template with ID ${id}:`, error);
      
      // For guest users, update in localStorage
      if (!supabase.auth.getSession()) {
        return this.localStorage.updateLocalTemplate(id, updates);
      }
      
      toast.error("Failed to update template");
      throw error;
    }
  }

  /**
   * Deletes a template
   */
  async deleteTemplate(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('design_templates')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update cache
      this.cache.invalidateTemplate(id);
      this.cache.invalidateAllTemplates(); // Invalidate the all templates cache
      
      toast.success("Template deleted");
    } catch (error) {
      console.error(`Error deleting template with ID ${id}:`, error);
      
      // For guest users, delete from localStorage
      if (!supabase.auth.getSession()) {
        this.localStorage.deleteLocalTemplate(id);
        return;
      }
      
      toast.error("Failed to delete template");
      throw error;
    }
  }

  /**
   * Publishes a template (changes status to 'published')
   */
  async publishTemplate(id: string): Promise<Template> {
    return this.updateTemplate(id, { status: 'published' });
  }
}

// Export singleton instance
export const templateService = new TemplateService();
