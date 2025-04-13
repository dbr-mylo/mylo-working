
import { NavigationEvent } from '@/utils/navigation/types';

/**
 * Service for tracking and analyzing navigation history
 */
export class NavigationHistoryService {
  private history: NavigationEvent[] = [];
  private maxHistorySize: number = 100;
  
  /**
   * Add a navigation event to history
   * @param event Navigation event to add
   */
  public addToHistory(event: NavigationEvent): void {
    this.history.unshift(event);
    
    // Trim history to max size
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(0, this.maxHistorySize);
    }
    
    // In a real application, we might persist this to localStorage
    this.persistHistory();
  }
  
  /**
   * Get full navigation history
   * @returns Array of navigation events
   */
  public getHistory(): NavigationEvent[] {
    return [...this.history];
  }
  
  /**
   * Get recent navigation history
   * @param limit Maximum number of events to return
   * @returns Recent navigation events
   */
  public getRecentHistory(limit: number = 10): NavigationEvent[] {
    return this.history.slice(0, limit);
  }
  
  /**
   * Get navigation history for a specific path
   * @param path Route path
   * @returns Navigation events for the specified path
   */
  public getHistoryForPath(path: string): NavigationEvent[] {
    return this.history.filter(
      event => event.from === path || event.to === path
    );
  }
  
  /**
   * Get most frequently visited routes
   * @param limit Maximum number of routes to return
   * @returns Array of routes sorted by visit frequency
   */
  public getMostFrequentRoutes(limit: number = 5): { path: string; count: number }[] {
    const routeCounts: Record<string, number> = {};
    
    this.history.forEach(event => {
      if (event.success) {
        routeCounts[event.to] = (routeCounts[event.to] || 0) + 1;
      }
    });
    
    return Object.entries(routeCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
  
  /**
   * Clear navigation history
   */
  public clearHistory(): void {
    this.history = [];
    this.persistHistory();
  }
  
  /**
   * Persist history to localStorage
   * In a production app, this might use a more robust storage solution
   */
  private persistHistory(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'navigation_history', 
          JSON.stringify(this.history.slice(0, 20)) // Save only recent history
        );
      } catch (error) {
        console.error('Failed to persist navigation history:', error);
      }
    }
  }
  
  /**
   * Load persisted history from localStorage
   */
  public loadPersistedHistory(): void {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('navigation_history');
        if (saved) {
          this.history = JSON.parse(saved);
        }
      } catch (error) {
        console.error('Failed to load navigation history:', error);
      }
    }
  }
}

export const navigationHistoryService = new NavigationHistoryService();
navigationHistoryService.loadPersistedHistory();
