
import { v4 as uuidv4 } from 'uuid';
import { Template } from '@/lib/types';

// Get templates from localStorage
export const getTemplates = async (): Promise<Template[]> => {
  try {
    const templatesJson = localStorage.getItem('templates') || '[]';
    return JSON.parse(templatesJson);
  } catch (error) {
    console.error('Error loading templates:', error);
    return [];
  }
};

// Get a single template by ID
export const getTemplateById = async (id: string): Promise<Template | null> => {
  try {
    const templates = await getTemplates();
    return templates.find(template => template.id === id) || null;
  } catch (error) {
    console.error('Error getting template by ID:', error);
    return null;
  }
};

// Save a template to localStorage
export const saveTemplate = async (template: Omit<Template, 'id'> & { id?: string }): Promise<Template> => {
  try {
    const templates = await getTemplates();
    
    const newTemplate: Template = {
      id: template.id || uuidv4(),
      name: template.name,
      styles: template.styles,
      owner_id: template.owner_id,
      status: template.status,
      category: template.category,
      version: template.version,
    };
    
    // Update existing or add new
    const existingIndex = templates.findIndex(t => t.id === newTemplate.id);
    if (existingIndex >= 0) {
      templates[existingIndex] = newTemplate;
    } else {
      templates.push(newTemplate);
    }
    
    localStorage.setItem('templates', JSON.stringify(templates));
    return newTemplate;
  } catch (error) {
    console.error('Error saving template:', error);
    throw new Error('Failed to save template');
  }
};

// Delete a template by ID
export const deleteTemplate = async (id: string): Promise<void> => {
  try {
    const templates = await getTemplates();
    const updatedTemplates = templates.filter(template => template.id !== id);
    localStorage.setItem('templates', JSON.stringify(updatedTemplates));
  } catch (error) {
    console.error('Error deleting template:', error);
    throw new Error('Failed to delete template');
  }
};

// Export the templateStore object
export const templateStore = {
  getTemplates,
  getTemplateById,
  saveTemplate,
  deleteTemplate,
};
