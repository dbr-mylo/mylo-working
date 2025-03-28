
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react-hooks';
import { useRoleAwareErrorHandling } from '@/hooks/useErrorHandling';
import { useAuth } from '@/contexts/AuthContext';
import { handleError } from '@/utils/error/handleError';
import { getRoleSpecificErrorMessage } from '@/utils/error/roleSpecificErrors';
import { beforeEach } from '../testUtils';

// Mock dependencies
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/utils/error/handleError', () => ({
  handleError: vi.fn(),
}));

vi.mock('@/utils/error/roleSpecificErrors', () => ({
  getRoleSpecificErrorMessage: vi.fn(),
}));

describe('useRoleAwareErrorHandling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ role: 'user' });
    (getRoleSpecificErrorMessage as any).mockReturnValue('Role-specific error message');
  });
  
  it('should get role from auth context', () => {
    renderHook(() => useRoleAwareErrorHandling());
    
    expect(useAuth).toHaveBeenCalled();
  });
  
  it('should generate role-specific message and call handleError', () => {
    const { result } = renderHook(() => useRoleAwareErrorHandling());
    const error = new Error('Test error');
    const context = 'TestContext';
    
    result.current.handleRoleAwareError(error, context);
    
    expect(getRoleSpecificErrorMessage).toHaveBeenCalledWith(error, 'user', context);
    expect(handleError).toHaveBeenCalledWith(error, context, 'Role-specific error message');
  });
  
  it('should use provided user message if available', () => {
    const { result } = renderHook(() => useRoleAwareErrorHandling());
    const error = new Error('Test error');
    const context = 'TestContext';
    const userMessage = 'Custom user message';
    
    result.current.handleRoleAwareError(error, context, userMessage);
    
    expect(getRoleSpecificErrorMessage).toHaveBeenCalledWith(error, 'user', context);
    expect(handleError).toHaveBeenCalledWith(error, context, userMessage);
  });
  
  it('should handle different roles from auth context', () => {
    (useAuth as any).mockReturnValue({ role: 'admin' });
    
    const { result } = renderHook(() => useRoleAwareErrorHandling());
    const error = new Error('Test error');
    const context = 'TestContext';
    
    result.current.handleRoleAwareError(error, context);
    
    expect(getRoleSpecificErrorMessage).toHaveBeenCalledWith(error, 'admin', context);
  });
});
