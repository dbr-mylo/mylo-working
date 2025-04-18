
import { UserRole } from '@/utils/navigation/types';
import { RouteValidator } from '../validation/RouteValidator';

export class NavigationValidationService {
  private validator: RouteValidator;

  constructor() {
    this.validator = new RouteValidator();
  }

  public validateRoute(path: string, role: UserRole): boolean {
    return this.validator.validateRoute(path, role);
  }

  public extractRouteParameters(definedPath: string, actualPath: string): Record<string, string> | null {
    const pathParts = actualPath.split('/');
    const routeParts = definedPath.split('/');

    if (pathParts.length !== routeParts.length) {
      return null;
    }

    const params: Record<string, string> = {};

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        const paramName = routeParts[i].slice(1);
        params[paramName] = pathParts[i];
      } else if (routeParts[i] !== pathParts[i]) {
        return null;
      }
    }

    return params;
  }
}

export const navigationValidationService = new NavigationValidationService();
