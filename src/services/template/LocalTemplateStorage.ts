
import { Template } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

/**
 * Class for storing templates in localStorage (for guest users)
 */
export class LocalTemplateStorage {
  private storageKey = 'local_templates';

  /**
   * Retrieves all local templates
   */
  getLocalTemplates(): Template[] {
    try {
      const storedTemplates = localStorage.getItem(this.storageKey);
      if (!storedTemplates) return [];
      
      return JSON.parse(storedTemplates);
    } catch (error) {
      console.error("Error retrieving local templates:", error);
      return [];
    }
  }

  /**
   * Gets a local template by ID
   */
  getLocalTemplateById(id: string): Template | null {
    try {
      const templates = this.getLocalTemplates();
      return templates.find(template => template.id === id) || null;
    } catch (error) {
      console.error(`Error retrieving local template with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Creates a new local template
   */
  createLocalTemplate(template: Omit<Template, 'id'>): Template {
    try {
      const templates = this.getLocalTemplates();
      
      const newTemplate: Template = {
        ...template,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      templates.push(newTemplate);
      localStorage.setItem(this.storageKey, JSON.stringify(templates));
      
      return newTemplate;
    } catch (error) {
      console.error("Error creating local template:", error);
      throw error;
    }
  }

  /**
   * Updates an existing local template
   */
  updateLocalTemplate(id: string, updates: Partial<Template>): Template {
    try {
      const templates = this.getLocalTemplates();
      const templateIndex = templates.findIndex(template => template.id === id);
      
      if (templateIndex === -1) {
        throw new Error(`Template with ID ${id} not found`);
      }
      
      templates[templateIndex] = {
        ...templates[templateIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(templates));
      
      return templates[templateIndex];
    } catch (error) {
      console.error(`Error updating local template with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Deletes a local template
   */
  deleteLocalTemplate(id: string): void {
    try {
      const templates = this.getLocalTemplates();
      const updatedTemplates = templates.filter(template => template.id !== id);
      
      localStorage.setItem(this.storageKey, JSON.stringify(updatedTemplates));
    } catch (error) {
      console.error(`Error deleting local template with ID ${id}:`, error);
      throw error;
    }
  }
}
