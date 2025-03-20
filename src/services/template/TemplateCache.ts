
import { Template } from "@/lib/types";

/**
 * Class for caching templates in memory to reduce API calls
 */
export class TemplateCache {
  private allTemplatesCache: { templates: Template[], timestamp: number } | null = null;
  private templateCache: Map<string, { template: Template, timestamp: number }> = new Map();
  private cacheExpirationMs = 5 * 60 * 1000; // 5 minutes

  /**
   * Get all cached templates if they exist and aren't expired
   */
  getCachedTemplates(): Template[] | null {
    if (!this.allTemplatesCache) return null;
    
    const now = Date.now();
    if (now - this.allTemplatesCache.timestamp > this.cacheExpirationMs) {
      this.allTemplatesCache = null;
      return null;
    }
    
    return this.allTemplatesCache.templates;
  }

  /**
   * Cache all templates
   */
  cacheAllTemplates(templates: Template[]): void {
    this.allTemplatesCache = {
      templates,
      timestamp: Date.now()
    };
  }

  /**
   * Invalidate all templates cache
   */
  invalidateAllTemplates(): void {
    this.allTemplatesCache = null;
  }

  /**
   * Get a cached template by ID if it exists and isn't expired
   */
  getCachedTemplate(id: string): Template | null {
    const cachedTemplate = this.templateCache.get(id);
    if (!cachedTemplate) return null;
    
    const now = Date.now();
    if (now - cachedTemplate.timestamp > this.cacheExpirationMs) {
      this.templateCache.delete(id);
      return null;
    }
    
    return cachedTemplate.template;
  }

  /**
   * Cache a template
   */
  cacheTemplate(template: Template): void {
    this.templateCache.set(template.id, {
      template,
      timestamp: Date.now()
    });
  }

  /**
   * Invalidate a cached template
   */
  invalidateTemplate(id: string): void {
    this.templateCache.delete(id);
  }

  /**
   * Clear the entire cache
   */
  clearCache(): void {
    this.allTemplatesCache = null;
    this.templateCache.clear();
  }
}
