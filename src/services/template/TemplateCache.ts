
import { Template } from "@/lib/types";

/**
 * Cache management for template service
 * Handles caching of templates to reduce database queries
 */
export class TemplateCache {
  private cache: Map<string, Template> = new Map();
  private allTemplatesCache: Template[] | null = null;
  private lastFetchTimestamp: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL

  /**
   * Clears all cached template data
   */
  clearCache(): void {
    this.cache.clear();
    this.allTemplatesCache = null;
    this.lastFetchTimestamp = 0;
  }

  /**
   * Checks if the cache is still valid based on TTL
   */
  isCacheValid(): boolean {
    return Date.now() - this.lastFetchTimestamp < this.CACHE_TTL;
  }

  /**
   * Gets a template from cache if available
   */
  getCachedTemplate(id: string): Template | null {
    if (this.cache.has(id) && this.isCacheValid()) {
      return this.cache.get(id) || null;
    }
    return null;
  }

  /**
   * Gets all templates from cache if available
   */
  getCachedTemplates(): Template[] | null {
    if (this.allTemplatesCache && this.isCacheValid()) {
      return this.allTemplatesCache;
    }
    return null;
  }

  /**
   * Sets a template in the cache
   */
  cacheTemplate(template: Template): void {
    this.cache.set(template.id, template);
  }

  /**
   * Sets the all templates cache
   */
  cacheAllTemplates(templates: Template[]): void {
    this.allTemplatesCache = templates;
    this.lastFetchTimestamp = Date.now();
    
    // Also cache individual templates
    templates.forEach(template => {
      this.cache.set(template.id, template);
    });
  }

  /**
   * Invalidates a specific template in the cache
   */
  invalidateTemplate(id: string): void {
    this.cache.delete(id);
  }

  /**
   * Invalidates the all templates cache
   */
  invalidateAllTemplates(): void {
    this.allTemplatesCache = null;
  }
}
