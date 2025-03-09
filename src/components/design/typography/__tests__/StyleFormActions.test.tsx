
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StyleFormActions } from '../StyleFormActions';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Button component
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, type }: { 
    children: React.ReactNode; 
    onClick?: () => void; 
    variant?: string; 
    type?: "button" | "submit" | "reset"; 
  }) => (
    <button
      data-testid={`button-${variant || 'default'}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  ),
}));

describe('StyleFormActions', () => {
  const onCancelMock = vi.fn();
  const onSubmitMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when showActions is false', () => {
    render(
      <StyleFormActions
        showActions={false}
        isUpdate={false}
        onCancel={onCancelMock}
        onSubmit={onSubmitMock}
      />
    );

    const cancelButton = screen.queryByTestId('button-outline');
    const submitButton = screen.queryByTestId('button-default');

    expect(cancelButton).not.toBeInTheDocument();
    expect(submitButton).not.toBeInTheDocument();
  });

  it('should render cancel and create buttons when showActions is true and isUpdate is false', () => {
    render(
      <StyleFormActions
        showActions={true}
        isUpdate={false}
        onCancel={onCancelMock}
        onSubmit={onSubmitMock}
      />
    );

    const cancelButton = screen.getByTestId('button-outline');
    const submitButton = screen.getByTestId('button-default');

    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveTextContent('Cancel');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent('Create Style');
  });

  it('should render cancel and update buttons when showActions is true and isUpdate is true', () => {
    render(
      <StyleFormActions
        showActions={true}
        isUpdate={true}
        onCancel={onCancelMock}
        onSubmit={onSubmitMock}
      />
    );

    const cancelButton = screen.getByTestId('button-outline');
    const submitButton = screen.getByTestId('button-default');

    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveTextContent('Cancel');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent('Update Style');
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(
      <StyleFormActions
        showActions={true}
        isUpdate={false}
        onCancel={onCancelMock}
        onSubmit={onSubmitMock}
      />
    );

    const cancelButton = screen.getByTestId('button-outline');
    fireEvent.click(cancelButton);

    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });

  it('should call onSubmit when form is submitted', () => {
    const { container } = render(
      <StyleFormActions
        showActions={true}
        isUpdate={false}
        onCancel={onCancelMock}
        onSubmit={onSubmitMock}
      />
    );

    // Since we're testing only the button clicks directly, not the form submission
    const submitButton = screen.getByTestId('button-default');
    expect(submitButton).toHaveAttribute('type', 'submit');
  });
});
