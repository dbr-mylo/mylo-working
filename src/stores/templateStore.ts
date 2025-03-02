
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";

export interface Template {
  id: string;
  name: string;
  styles: string;
}

export interface SaveTemplateInput {
  id?: string;
  name: string;
  styles: string;
}

const TEMPLATE_STORAGE_KEY = 'design_templates';

export const templateStore = {
  async getTemplates(): Promise<Template[]> {
    try {
      // For authenticated designers, fetch from Supabase
      const { data: session } = await supabase.auth.getSession();
      if (session.session?.user) {
        const { data, error } = await supabase
          .from('design_templates')
          .select('*');
          
        if (error) {
          console.error('Error fetching templates from Supabase:', error);
          return this.getLocalTemplates();
        }
        
        return data as Template[];
      }
      
      // For guest designers, fetch from localStorage
      return this.getLocalTemplates();
    } catch (error) {
      console.error('Error in getTemplates:', error);
      return this.getLocalTemplates();
    }
  },
  
  getLocalTemplates(): Template[] {
    try {
      const templatesJSON = localStorage.getItem(TEMPLATE_STORAGE_KEY);
      if (templatesJSON) {
        return JSON.parse(templatesJSON);
      }
    } catch (error) {
      console.error('Error parsing templates from localStorage:', error);
    }
    return [];
  },
  
  async saveTemplate(template: SaveTemplateInput): Promise<Template> {
    try {
      const templateToSave: Template = {
        id: template.id || uuidv4(),
        name: template.name,
        styles: template.styles
      };
      
      // For authenticated designers, save to Supabase
      const { data: session } = await supabase.auth.getSession();
      if (session.session?.user) {
        const { error } = await supabase
          .from('design_templates')
          .upsert({
            id: templateToSave.id,
            name: templateToSave.name,
            styles: templateToSave.styles,
            owner_id: session.session.user.id
          });
          
        if (error) {
          console.error('Error saving template to Supabase:', error);
          this.saveLocalTemplate(templateToSave);
        }
        
        return templateToSave;
      }
      
      // For guest designers, save to localStorage
      this.saveLocalTemplate(templateToSave);
      return templateToSave;
    } catch (error) {
      console.error('Error in saveTemplate:', error);
      throw error;
    }
  },
  
  saveLocalTemplate(template: Template): void {
    try {
      const templates = this.getLocalTemplates();
      const existingIndex = templates.findIndex(t => t.id === template.id);
      
      if (existingIndex >= 0) {
        templates[existingIndex] = template;
      } else {
        templates.push(template);
      }
      
      localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error('Error saving template to localStorage:', error);
      throw error;
    }
  },
  
  async deleteTemplate(id: string): Promise<void> {
    try {
      // For authenticated designers, delete from Supabase
      const { data: session } = await supabase.auth.getSession();
      if (session.session?.user) {
        const { error } = await supabase
          .from('design_templates')
          .delete()
          .eq('id', id);
          
        if (error) {
          console.error('Error deleting template from Supabase:', error);
        }
      }
      
      // Also delete from localStorage (for both authenticated and guest users)
      const templates = this.getLocalTemplates();
      const filteredTemplates = templates.filter(t => t.id !== id);
      localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(filteredTemplates));
    } catch (error) {
      console.error('Error in deleteTemplate:', error);
      throw error;
    }
  }
};
