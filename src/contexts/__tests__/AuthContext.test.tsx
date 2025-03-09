
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toast } from 'sonner';

// Mock the entire supabase module
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn()
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn()
  }
}));

// Mock the toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Mock useNavigate
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn()
}));

// Test component to access auth context
const TestComponent = () => {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="auth-state">{JSON.stringify({ user: auth.user, role: auth.role })}</div>
      <button data-testid="sign-in" onClick={() => auth.signIn('test@example.com', 'password')}>Sign In</button>
      <button data-testid="sign-up" onClick={() => auth.signUp('test@example.com', 'password')}>Sign Up</button>
      <button data-testid="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
      <button data-testid="guest-editor" onClick={() => auth.continueAsGuestEditor()}>Guest Editor</button>
      <button data-testid="guest-designer" onClick={() => auth.continueAsGuestDesigner()}>Guest Designer</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock successful session retrieval
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null
    } as any);
  });

  it('should provide auth state and methods', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    // Initial state should have null user and role, with isLoading false
    await waitFor(() => {
      const authState = screen.getByTestId('auth-state');
      const state = JSON.parse(authState.textContent || '{}');
      expect(state).toEqual({ user: null, role: null });
    });
  });

  it('should handle sign in', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: { id: 'user-id' } },
      error: null
    } as any);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    const signInButton = screen.getByTestId('sign-in');
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password'
      });
    });
  });

  it('should handle sign up', async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null },
      error: null
    } as any);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    const signUpButton = screen.getByTestId('sign-up');
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password'
      });
      expect(toast.success).toHaveBeenCalledWith('Check your email to confirm your account');
    });
  });

  it('should handle sign out', async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({
      error: null
    } as any);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    const signOutButton = screen.getByTestId('sign-out');
    fireEvent.click(signOutButton);

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  it('should handle guest editor mode', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    const guestEditorButton = screen.getByTestId('guest-editor');
    fireEvent.click(guestEditorButton);

    await waitFor(() => {
      const authState = screen.getByTestId('auth-state');
      const state = JSON.parse(authState.textContent || '{}');
      expect(state).toEqual({ user: null, role: 'editor' });
      expect(toast.success).toHaveBeenCalledWith('Continuing as Editor');
    });
  });

  it('should handle guest designer mode', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    const guestDesignerButton = screen.getByTestId('guest-designer');
    fireEvent.click(guestDesignerButton);

    await waitFor(() => {
      const authState = screen.getByTestId('auth-state');
      const state = JSON.parse(authState.textContent || '{}');
      expect(state).toEqual({ user: null, role: 'designer' });
      expect(toast.success).toHaveBeenCalledWith('Continuing as Designer');
    });
  });
});
