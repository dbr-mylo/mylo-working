
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useAutomaticBackup } from '@/hooks/document/useAutomaticBackup';
import { documentRecoveryService } from '@/services/DocumentRecoveryService';

// Mock the document recovery service
vi.mock('@/services/DocumentRecoveryService', () => ({
  documentRecoveryService: {
    initialize: vi.fn(),
    startAutoBackup: vi.fn(),
    dispose: vi.fn(),
    createBackup: vi.fn(),
    hasBackup: vi.fn(),
  }
}));

describe('useAutomaticBackup', () => {
  // Reset the clock after each test to prevent timer-related issues
  afterEach(() => {
    vi.useRealTimers();
  });
  
  it('should initialize the recovery service on mount', () => {
    // Render the hook
    renderHook(() => useAutomaticBackup({
      documentId: 'test-doc-123',
      documentTitle: 'Test Document',
      content: 'Initial content',
      initialContent: 'Initial content',
      userRole: 'writer',
    }));
    
    // Verify the service was initialized
    expect(documentRecoveryService.initialize).toHaveBeenCalledWith(
      'test-doc-123',
      'Test Document',
      'writer',
      expect.any(Function)
    );
    
    // And that auto-backup was started
    expect(documentRecoveryService.startAutoBackup).toHaveBeenCalledWith('Initial content');
  });
  
  it('should create a backup when content changes significantly', () => {
    // Mock hasBackup to return false
    vi.mocked(documentRecoveryService.hasBackup).mockReturnValue(false);
    
    // Mock createBackup to return true
    vi.mocked(documentRecoveryService.createBackup).mockReturnValue(true);
    
    // Initial render with initial content
    const { result, rerender } = renderHook(
      ({ content }) => useAutomaticBackup({
        documentId: 'test-doc-123',
        documentTitle: 'Test Document',
        content,
        initialContent: 'Initial content',
        userRole: 'writer',
        backupThreshold: 10, // Only backup when content changes by 10+ chars
      }),
      { initialProps: { content: 'Initial content' } }
    );
    
    // Verify initial state
    expect(result.current.hasBackup).toBe(false);
    expect(documentRecoveryService.createBackup).not.toHaveBeenCalled();
    
    // Change content by less than the threshold
    rerender({ content: 'Initial content.' }); // Only 1 char added
    
    // Should not create backup yet
    expect(documentRecoveryService.createBackup).not.toHaveBeenCalled();
    
    // Change content by more than the threshold
    rerender({ content: 'Initial content with significant changes' }); // Many chars added
    
    // Should create a backup now
    expect(documentRecoveryService.createBackup).toHaveBeenCalledWith(
      'Initial content with significant changes'
    );
    expect(result.current.hasBackup).toBe(true);
  });
  
  it('should allow enabling and disabling backup', () => {
    // Render the hook
    const { result } = renderHook(() => useAutomaticBackup({
      documentId: 'test-doc-123',
      documentTitle: 'Test Document',
      content: 'Test content',
      initialContent: 'Initial content',
      userRole: 'writer',
    }));
    
    // Check initial state
    expect(result.current.isBackupEnabled).toBe(true);
    
    // Disable backup
    act(() => {
      result.current.setBackupEnabled(false);
    });
    
    // Check updated state
    expect(result.current.isBackupEnabled).toBe(false);
    
    // Enable backup again
    act(() => {
      result.current.setBackupEnabled(true);
    });
    
    // Check updated state
    expect(result.current.isBackupEnabled).toBe(true);
  });
  
  it('should create backup on manual request', () => {
    // Mock createBackup to return true
    vi.mocked(documentRecoveryService.createBackup).mockReturnValue(true);
    
    // Render the hook
    const { result } = renderHook(() => useAutomaticBackup({
      documentId: 'test-doc-123',
      documentTitle: 'Test Document',
      content: 'Test content',
      initialContent: 'Initial content',
      userRole: 'writer',
    }));
    
    // Call manual backup
    let backupResult;
    act(() => {
      backupResult = result.current.manualBackup();
    });
    
    // Verify backup was created
    expect(backupResult).toBe(true);
    expect(documentRecoveryService.createBackup).toHaveBeenCalledWith('Test content');
    expect(result.current.hasBackup).toBe(true);
  });
  
  it('should create backup when user is idle', () => {
    // Use fake timers for this test
    vi.useFakeTimers();
    
    // Mock createBackup to return true
    vi.mocked(documentRecoveryService.createBackup).mockReturnValue(true);
    
    // Render the hook with idle backup enabled
    const { result } = renderHook(() => useAutomaticBackup({
      documentId: 'test-doc-123',
      documentTitle: 'Test Document',
      content: 'Test content',
      initialContent: 'Initial content',
      userRole: 'writer',
      backupOnIdle: true,
      idleTime: 1000, // 1 second for testing
    }));
    
    // Clear createBackup calls from initialization
    vi.mocked(documentRecoveryService.createBackup).mockClear();
    
    // Fast-forward time to trigger idle backup
    vi.advanceTimersByTime(1500); // Advance past the idle time
    
    // Verify backup was created
    expect(documentRecoveryService.createBackup).toHaveBeenCalledWith('Test content');
  });
});
