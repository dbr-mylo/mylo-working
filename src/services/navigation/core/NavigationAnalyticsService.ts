
import { NavigationEvent, UserRole } from '@/utils/navigation/types';

export class NavigationAnalyticsService {
  private writerMetricsKey = 'writer_navigation_metrics';

  public logWriterNavigation(event: NavigationEvent): void {
    if (event.userRole !== 'writer') return;

    const isContentRelated = event.to.includes('/content/') || 
                            event.to.includes('/editor') || 
                            event.to === '/writer-dashboard';
                               
    if (isContentRelated) {
      console.info(`[Writer Analytics] Content interaction: ${event.to}`);
      
      if (typeof localStorage !== 'undefined') {
        try {
          const metrics = JSON.parse(localStorage.getItem(this.writerMetricsKey) || '{}');
          metrics[event.to] = (metrics[event.to] || 0) + 1;
          localStorage.setItem(this.writerMetricsKey, JSON.stringify(metrics));
        } catch (e) {
          console.error('Error storing writer metrics:', e);
        }
      }
    }
  }

  public getWriterNavigationMetrics(): Record<string, number> {
    if (typeof localStorage === 'undefined') {
      return {};
    }
    
    try {
      return JSON.parse(localStorage.getItem(this.writerMetricsKey) || '{}');
    } catch (e) {
      console.error('Error retrieving writer metrics:', e);
      return {};
    }
  }

  public getMostFrequentRoutes(events: NavigationEvent[], limit: number = 5): { path: string; count: number }[] {
    const routeCounts: Record<string, number> = {};
    
    events.forEach(event => {
      if (event.success) {
        routeCounts[event.to] = (routeCounts[event.to] || 0) + 1;
      }
    });
    
    return Object.entries(routeCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
}

export const navigationAnalyticsService = new NavigationAnalyticsService();
