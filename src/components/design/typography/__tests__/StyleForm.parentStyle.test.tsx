
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StyleForm } from '../StyleForm';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  mockInitialValues, 
  mockSubmit, 
  setupTextStyleStoreMock,
  setupComponentMocks 
} from './utils/styleMocks';

// Setup component mocks
setupComponentMocks();
setupTextStyleStoreMock();

describe('StyleForm Parent Style', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and set parent style when parentId changes', async () => {
    const mockWithParent = {
      ...mockInitialValues,
      parentId: 'parent-id',
    };

    const { findByTestId } = render(
      <StyleForm 
        initialValues={mockWithParent} 
        onSubmit={mockSubmit}
      />
    );
    
    // Initially parent is not set yet (async operation)
    const initialPreview = screen.getByTestId('style-form-preview');
    expect(initialPreview).toHaveAttribute('data-parent', 'none');
    
    // After the async operation completes
    const updatedPreview = await findByTestId('style-form-preview');
    expect(updatedPreview).toHaveAttribute('data-parent', 'parent-id');
  });
});
