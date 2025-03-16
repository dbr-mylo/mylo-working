
import { Template } from "@/lib/types";
import { toast } from "sonner";

/**
 * Local storage implementation for templates
 * Used as a fallback for guest users without database access
 */
export class LocalTemplateStorage {
  private readonly STORAGE_KEY = 'designerTemplates';
  
  /**
   * Gets all templates from localStorage
   */
  getLocalTemplates(): Template[] {
    try {
      const templates = localStorage.getItem(this.STORAGE_KEY);
      return templates ? JSON.parse(templates) : [];
    } catch (error) {
      console.error("Error reading templates from localStorage:", error);
      return [];
    }
  }

  /**
   * Gets a specific template by ID from localStorage
   */
  getLocalTemplateById(id: string): Template | null {
    const templates = this.getLocalTemplates();
    return templates.find(t => t.id === id) || null;
  }

  /**
   * Creates a new template in localStorage
   */
  createLocalTemplate(template: Omit<Template, 'id'>): Template {
    const templates = this.getLocalTemplates();
    const newTemplate: Template = {
      ...template,
      id: `local-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    templates.push(newTemplate);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(templates));
    toast.success(`Template "${newTemplate.name}" created locally`);
    return newTemplate;
  }

  /**
   * Updates an existing template in localStorage
   */
  updateLocalTemplate(id: string, updates: Partial<Template>): Template {
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
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(templates));
    toast.success(`Template "${updatedTemplate.name}" updated locally`);
    return updatedTemplate;
  }

  /**
   * Deletes a template from localStorage
   */
  deleteLocalTemplate(id: string): void {
    const templates = this.getLocalTemplates();
    const filteredTemplates = templates.filter(t => t.id !== id);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredTemplates));
    toast.success("Template deleted locally");
  }
}
