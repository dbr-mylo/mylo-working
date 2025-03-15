
import { supabase } from "@/integrations/supabase/client";
import { Template } from "@/lib/types";
import { toast } from "sonner";

class TemplateService {
  // Cache for templates to reduce database queries
  private cache: Map<string, Template> = new Map();
  private allTemplatesCache: Template[] | null = null;
  private lastFetchTimestamp: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL

  constructor() {
    // Subscribe to auth state changes to clear cache when user signs out
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        this.clearCache();
      }
    });
  }

  private clearCache() {
    this.cache.clear();
    this.allTemplatesCache = null;
    this.lastFetchTimestamp = 0;
  }

  private isCacheValid(): boolean {
    return Date.now() - this.lastFetchTimestamp < this.CACHE_TTL;
  }

  async getTemplates(forceRefresh = false): Promise<Template[]> {
    // Return cached templates if available and not expired
    if (this.allTemplatesCache && this.isCacheValid() && !forceRefresh) {
      console.log("Using cached templates");
      return this.allTemplatesCache;
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
      this.allTemplatesCache = data as Template[];
      this.lastFetchTimestamp = Date.now();
      
      // Update individual template cache
      data.forEach(template => {
        this.cache.set(template.id, template as Template);
      });

      return data as Template[];
    } catch (error) {
      console.error("Error fetching templates:", error);
      
      // Try to get from localStorage as fallback for guest users
      if (!supabase.auth.getSession()) {
        return this.getLocalTemplates();
      }
      
      throw error;
    }
  }

  async getTemplateById(id: string): Promise<Template | null> {
    // Return from cache if available
    if (this.cache.has(id) && this.isCacheValid()) {
      return this.cache.get(id) || null;
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
      this.cache.set(id, template);
      return template;
    } catch (error) {
      console.error(`Error fetching template with ID ${id}:`, error);
      
      // Try to get from localStorage as fallback for guest users
      if (!supabase.auth.getSession()) {
        return this.getLocalTemplateById(id);
      }
      
      return null;
    }
  }

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
      this.clearCache();
      
      const newTemplate = data as Template;
      toast.success(`Template "${newTemplate.name}" created`);
      return newTemplate;
    } catch (error) {
      console.error("Error creating template:", error);
      
      // For guest users, save to localStorage
      if (!supabase.auth.getSession()) {
        return this.createLocalTemplate(template);
      }
      
      toast.error("Failed to create template");
      throw error;
    }
  }

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
      this.cache.set(id, updatedTemplate);
      this.allTemplatesCache = null; // Invalidate the all templates cache
      
      toast.success(`Template "${updatedTemplate.name}" updated`);
      return updatedTemplate;
    } catch (error) {
      console.error(`Error updating template with ID ${id}:`, error);
      
      // For guest users, update in localStorage
      if (!supabase.auth.getSession()) {
        return this.updateLocalTemplate(id, updates);
      }
      
      toast.error("Failed to update template");
      throw error;
    }
  }

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
      this.cache.delete(id);
      this.allTemplatesCache = null; // Invalidate the all templates cache
      
      toast.success("Template deleted");
    } catch (error) {
      console.error(`Error deleting template with ID ${id}:`, error);
      
      // For guest users, delete from localStorage
      if (!supabase.auth.getSession()) {
        this.deleteLocalTemplate(id);
        return;
      }
      
      toast.error("Failed to delete template");
      throw error;
    }
  }

  async publishTemplate(id: string): Promise<Template> {
    return this.updateTemplate(id, { status: 'published' });
  }

  // Guest user localStorage methods
  private getLocalTemplates(): Template[] {
    try {
      const templates = localStorage.getItem('designerTemplates');
      return templates ? JSON.parse(templates) : [];
    } catch (error) {
      console.error("Error reading templates from localStorage:", error);
      return [];
    }
  }

  private getLocalTemplateById(id: string): Template | null {
    const templates = this.getLocalTemplates();
    return templates.find(t => t.id === id) || null;
  }

  private createLocalTemplate(template: Omit<Template, 'id'>): Template {
    const templates = this.getLocalTemplates();
    const newTemplate: Template = {
      ...template,
      id: `local-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    templates.push(newTemplate);
    localStorage.setItem('designerTemplates', JSON.stringify(templates));
    toast.success(`Template "${newTemplate.name}" created locally`);
    return newTemplate;
  }

  private updateLocalTemplate(id: string, updates: Partial<Template>): Template {
    const templates = this.getLocalTemplates();
    const index = templates.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error(`Template with ID ${id} not found`);
    }
    
    const updatedTemplate: Template = {
      ...templates[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    templates[index] = updatedTemplate;
    localStorage.setItem('designerTemplates', JSON.stringify(templates));
    toast.success(`Template "${updatedTemplate.name}" updated locally`);
    return updatedTemplate;
  }

  private deleteLocalTemplate(id: string): void {
    const templates = this.getLocalTemplates();
    const filteredTemplates = templates.filter(t => t.id !== id);
    
    localStorage.setItem('designerTemplates', JSON.stringify(filteredTemplates));
    toast.success("Template deleted locally");
  }
}

// Export singleton instance
export const templateService = new TemplateService();
