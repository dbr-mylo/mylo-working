
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorDisplay, EmptyStateWithError, RecoverableErrorState } from '@/components/errors/ErrorDisplay';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleSpecificErrorMessage } from '@/utils/error/roleSpecificErrors';
import { beforeEach } from '../../testUtils';
import '@testing-library/jest-dom'; // Import jest-dom for the matchers

// Mock dependencies
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/utils/error/roleSpecificErrors', () => ({
  getRoleSpecificErrorMessage: vi.fn(),
}));

vi.mock('@/utils/error/errorResolution', () => ({
  getErrorResolutionSteps: vi.fn().mockReturnValue([
    'Step 1', 'Step 2', 'Step 3'
  ]),
}));

describe('ErrorDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ role: 'user' });
    (getRoleSpecificErrorMessage as any).mockImplementation((error) => {
      return error instanceof Error ? error.message : String(error);
    });
  });
  
  it('should display error message', () => {
    const error = new Error('Test error');
    const context = 'TestContext';
    
    render(<ErrorDisplay error={error} context={context} />);
    
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });
  
  it('should show retry button when provided', () => {
    const error = new Error('Test error');
    const context = 'TestContext';
    const onRetry = vi.fn();
    
    render(
      <ErrorDisplay 
        error={error} 
        context={context}
        onRetry={onRetry}
        showRetry={true}
      />
    );
    
    const retryButton = screen.getByText('Retry');
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
  
  it('should not show retry button when showRetry is false', () => {
    const error = new Error('Test error');
    const context = 'TestContext';
    const onRetry = vi.fn();
    
    render(
      <ErrorDisplay 
        error={error} 
        context={context}
        onRetry={onRetry}
        showRetry={false}
      />
    );
    
    expect(screen.queryByText('Retry')).not.toBeInTheDocument();
  });
  
  it('should toggle resolution guide when show help button is clicked', () => {
    const error = new Error('Test error');
    const context = 'TestContext';
    
    render(<ErrorDisplay error={error} context={context} />);
    
    // Initially guide should be hidden
    expect(screen.queryByText('How to resolve this issue:')).not.toBeInTheDocument();
    
    // Click show help button
    fireEvent.click(screen.getByText('Show Help'));
    
    // Guide should be visible
    expect(screen.getByText('How to resolve this issue:')).toBeInTheDocument();
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    
    // Click hide help button
    fireEvent.click(screen.getByText('Hide Help'));
    
    // Guide should be hidden again
    expect(screen.queryByText('How to resolve this issue:')).not.toBeInTheDocument();
  });
});

describe('EmptyStateWithError', () => {
  it('should render title, description and error', () => {
    const error = new Error('Test error');
    const context = 'TestContext';
    
    render(
      <EmptyStateWithError 
        title="Test Title" 
        description="Test Description"
        error={error}
        context={context}
      />
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });
});

describe('RecoverableErrorState', () => {
  it('should render title and error with retry button', () => {
    const error = new Error('Test error');
    const context = 'TestContext';
    const onRetry = vi.fn();
    
    render(
      <RecoverableErrorState
        title="Recoverable Error"
        error={error}
        context={context}
        onRetry={onRetry}
      >
        <div data-testid="child-content">Additional content</div>
      </RecoverableErrorState>
    );
    
    expect(screen.getByText('Recoverable Error')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Retry'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
