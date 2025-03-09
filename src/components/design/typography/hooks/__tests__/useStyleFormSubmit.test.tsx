
import { renderHook, act } from '@testing-library/react-hooks';
import { useStyleFormSubmit } from '../useStyleFormSubmit';
import { StyleFormData, TextStyle } from '@/lib/types';
import { vi, describe, it, expect } from 'vitest';

describe('useStyleFormSubmit hook', () => {
  // Mock data
  const mockInitialValues: TextStyle = {
    id: 'test-id',
    name: 'Test Style',
    fontFamily: 'Arial',
    fontSize: '16px',
    fontWeight: '400',
    color: '#000000',
    lineHeight: '1.5',
    letterSpacing: '0px',
    selector: 'h1',
    textAlign: 'left'
  };

  const mockSubmitHandler = vi.fn();

  it('should determine if component is in update mode correctly', () => {
    // With initial values (update mode)
    const { result: updateResult } = renderHook(() => 
      useStyleFormSubmit({ initialValues: mockInitialValues, onSubmit: mockSubmitHandler })
    );
    
    expect(updateResult.current.isUpdate).toBe(true);
    
    // Without initial values (create mode)
    const { result: createResult } = renderHook(() => 
      useStyleFormSubmit({ initialValues: undefined, onSubmit: mockSubmitHandler })
    );
    
    expect(createResult.current.isUpdate).toBe(false);
  });

  it('should determine if form fields should be shown based on onSubmit prop', () => {
    // With onSubmit provided
    const { result: withSubmit } = renderHook(() => 
      useStyleFormSubmit({ initialValues: mockInitialValues, onSubmit: mockSubmitHandler })
    );
    
    expect(withSubmit.current.showFormFields).toBe(true);
    
    // Without onSubmit
    const { result: withoutSubmit } = renderHook(() => 
      useStyleFormSubmit({ initialValues: mockInitialValues, onSubmit: undefined })
    );
    
    expect(withoutSubmit.current.showFormFields).toBe(false);
  });

  it('should call onSubmit with form data when handleSubmit is called', () => {
    const preventDefault = vi.fn();
    const mockEvent = { preventDefault } as unknown as React.FormEvent;
    const mockFormData: StyleFormData = {
      name: 'Test Style',
      selector: 'h1',
      description: '',
      fontFamily: 'Arial',
      fontSize: '16px',
      fontWeight: '400',
      color: '#000000',
      lineHeight: '1.5',
      letterSpacing: '0px',
      textAlign: 'left'
    };

    const { result } = renderHook(() => 
      useStyleFormSubmit({ initialValues: mockInitialValues, onSubmit: mockSubmitHandler })
    );
    
    act(() => {
      result.current.handleSubmit(mockEvent, mockFormData);
    });
    
    expect(mockSubmitHandler).toHaveBeenCalledWith(mockFormData);
  });

  it('should not call onSubmit when it is not provided', () => {
    const preventDefault = vi.fn();
    const mockEvent = { preventDefault } as unknown as React.FormEvent;
    const mockFormData: StyleFormData = {
      name: 'Test Style',
      selector: 'h1',
      description: '',
      fontFamily: 'Arial',
      fontSize: '16px',
      fontWeight: '400',
      color: '#000000',
      lineHeight: '1.5',
      letterSpacing: '0px',
      textAlign: 'left'
    };

    const { result } = renderHook(() => 
      useStyleFormSubmit({ initialValues: mockInitialValues, onSubmit: undefined })
    );
    
    act(() => {
      result.current.handleSubmit(mockEvent, mockFormData);
    });
    
    expect(mockSubmitHandler).not.toHaveBeenCalled();
  });

  it('should call onSubmit with default values when handleCancel is called', () => {
    const { result } = renderHook(() => 
      useStyleFormSubmit({ initialValues: mockInitialValues, onSubmit: mockSubmitHandler })
    );
    
    act(() => {
      result.current.handleCancel();
    });
    
    expect(mockSubmitHandler).toHaveBeenCalledWith(expect.objectContaining({
      name: mockInitialValues.name,
      fontFamily: mockInitialValues.fontFamily,
      fontSize: mockInitialValues.fontSize,
      fontWeight: mockInitialValues.fontWeight,
      color: mockInitialValues.color,
      lineHeight: mockInitialValues.lineHeight,
      letterSpacing: mockInitialValues.letterSpacing,
      textAlign: mockInitialValues.textAlign,
      selector: '',
      description: '',
      parentId: undefined,
    }));
  });

  it('should not call onSubmit on cancel when it is not provided', () => {
    const { result } = renderHook(() => 
      useStyleFormSubmit({ initialValues: mockInitialValues, onSubmit: undefined })
    );
    
    act(() => {
      result.current.handleCancel();
    });
    
    expect(mockSubmitHandler).not.toHaveBeenCalled();
  });
});
