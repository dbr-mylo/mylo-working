
import { Template } from "@/lib/types";
import { toast } from "sonner";
import { TemplateCache } from "./TemplateCache";
import { LocalTemplateStorage } from "./LocalTemplateStorage";
import { templateAdapter } from "./TemplateAdapter";
import { templateErrorHandler } from "./TemplateErrorHandler";
import { supabase } from "@/integrations/supabase/client";

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
  async getTemplates(forceRefresh = false, timeoutMs = 5000): Promise<Template[]> {
    // Return cached templates if available and not expired
    const cachedTemplates = this.cache.getCachedTemplates();
    if (cachedTemplates && !forceRefresh) {
      console.log("Using cached templates");
      return cachedTemplates;
    }

    try {
      const templates = await templateAdapter.fetchAllTemplates(timeoutMs);
      
      // Update cache
      this.cache.cacheAllTemplates(templates);
      
      return templates;
    } catch (error) {
      templateErrorHandler.handleError('fetching templates', error);
      
      // Try to get from localStorage as fallback for guest users
      if (!templateAdapter.isAuthenticated()) {
        return this.localStorage.getLocalTemplates();
      }
      
      // If we're here, return empty array instead of throwing to prevent app crashes
      return [];
    }
  }

  /**
   * Gets a template by ID
   */
  async getTemplateById(id: string, timeoutMs = 5000): Promise<Template | null> {
    // Return from cache if available
    const cachedTemplate = this.cache.getCachedTemplate(id);
    if (cachedTemplate) {
      return cachedTemplate;
    }

    try {
      const template = await templateAdapter.fetchTemplateById(id, timeoutMs);
      
      if (template) {
        // Update cache
        this.cache.cacheTemplate(template);
      }
      
      return template;
    } catch (error) {
      templateErrorHandler.handleError(`fetching template with ID ${id}`, error);
      
      // Try to get from localStorage as fallback for guest users
      if (!templateAdapter.isAuthenticated()) {
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
      const newTemplate = await templateAdapter.createTemplate(template);
      
      // Clear cache to ensure fresh data
      this.cache.clearCache();
      
      templateErrorHandler.handleSuccess('created', newTemplate.name);
      return newTemplate;
    } catch (error) {
      templateErrorHandler.handleError('creating template', error);
      
      // For guest users, save to localStorage
      if (!templateAdapter.isAuthenticated()) {
        return this.localStorage.createLocalTemplate(template);
      }
      
      throw error;
    }
  }

  /**
   * Updates an existing template
   */
  async updateTemplate(id: string, updates: Partial<Template>): Promise<Template> {
    try {
      const updatedTemplate = await templateAdapter.updateTemplate(id, updates);
      
      // Update cache
      this.cache.cacheTemplate(updatedTemplate);
      this.cache.invalidateAllTemplates(); // Invalidate the all templates cache
      
      templateErrorHandler.handleSuccess('updated', updatedTemplate.name);
      return updatedTemplate;
    } catch (error) {
      templateErrorHandler.handleError(`updating template with ID ${id}`, error);
      
      // For guest users, update in localStorage
      if (!templateAdapter.isAuthenticated()) {
        return this.localStorage.updateLocalTemplate(id, updates);
      }
      
      throw error;
    }
  }

  /**
   * Deletes a template
   */
  async deleteTemplate(id: string): Promise<void> {
    try {
      await templateAdapter.deleteTemplate(id);
      
      // Update cache
      this.cache.invalidateTemplate(id);
      this.cache.invalidateAllTemplates(); // Invalidate the all templates cache
      
      templateErrorHandler.handleSuccess('deleted');
    } catch (error) {
      templateErrorHandler.handleError(`deleting template with ID ${id}`, error);
      
      // For guest users, delete from localStorage
      if (!templateAdapter.isAuthenticated()) {
        this.localStorage.deleteLocalTemplate(id);
        return;
      }
      
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
