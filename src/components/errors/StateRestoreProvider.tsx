
import React from 'react';

/**
 * State restore context for preserving state across errors
 */
export const StateRestoreContext = React.createContext<{
  saveState: <T>(key: string, state: T) => void;
  getState: <T>(key: string) => T | null;
}>({
  saveState: () => {},
  getState: () => null,
});

/**
 * Provider component for state restoration
 */
export function StateRestoreProvider({ children }: { children: React.ReactNode }) {
  // Use local storage for persistence
  const saveState = React.useCallback(<T,>(key: string, state: T) => {
    try {
      localStorage.setItem(`state_${key}`, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state:", e);
    }
  }, []);
  
  const getState = React.useCallback(<T,>(key: string): T | null => {
    try {
      const storedState = localStorage.getItem(`state_${key}`);
      return storedState ? JSON.parse(storedState) : null;
    } catch (e) {
      console.error("Failed to restore state:", e);
      return null;
    }
  }, []);
  
  return (
    <StateRestoreContext.Provider value={{ saveState, getState }}>
      {children}
    </StateRestoreContext.Provider>
  );
}

/**
 * Hook for using state restoration
 */
export function useStateRestore<T>(key: string, initialState: T) {
  const { saveState, getState } = React.useContext(StateRestoreContext);
  const [state, setState] = React.useState<T>(() => {
    const restoredState = getState<T>(key);
    return restoredState !== null ? restoredState : initialState;
  });
  
  // Save state when it changes
  React.useEffect(() => {
    saveState(key, state);
  }, [key, state, saveState]);
  
  return [state, setState] as const;
}
