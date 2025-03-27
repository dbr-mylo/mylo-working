
import { TestItem } from '../hooks/usePersistentTestResults';

export const initialTestItems: TestItem[] = [
  // Base toolbar tests
  { id: 'base-1', description: 'Base toolbar renders correctly', category: 'base', priority: 'high', status: 'untested', notes: '' },
  { id: 'base-2', description: 'Text formatting buttons (bold, italic) function correctly', category: 'base', priority: 'high', status: 'untested', notes: '' },
  { id: 'base-3', description: 'List controls create appropriate markup', category: 'base', priority: 'medium', status: 'untested', notes: '' },
  { id: 'base-4', description: 'Text alignment controls change text alignment properly', category: 'base', priority: 'medium', status: 'untested', notes: '' },
  { id: 'base-5', description: 'Indentation controls adjust text indentation correctly', category: 'base', priority: 'low', status: 'untested', notes: '' },
  
  // Writer role tests
  { id: 'writer-1', description: 'Writer toolbar components render for writer role', category: 'role-writer', priority: 'high', status: 'untested', notes: '' },
  { id: 'writer-2', description: 'Writer toolbar components do NOT render for designer role', category: 'role-writer', priority: 'high', status: 'untested', notes: '' },
  { id: 'writer-3', description: 'Text controls display correctly for writer role', category: 'role-writer', priority: 'medium', status: 'untested', notes: '' },
  { id: 'writer-4', description: 'EditorToolbar properly shows content for writer role only', category: 'role-writer', priority: 'high', status: 'untested', notes: '' },
  { id: 'writer-5', description: 'StandaloneEditorOnly component correctly shows content for writer role', category: 'role-writer', priority: 'high', status: 'untested', notes: '' },
  { id: 'writer-6', description: 'useIsWriter hook returns true for both writer and editor roles', category: 'role-writer', priority: 'high', status: 'untested', notes: '' },
  { id: 'writer-7', description: 'WriterOnly component shows content for both writer and editor roles', category: 'role-writer', priority: 'high', status: 'untested', notes: '' },
  
  // Designer role tests
  { id: 'designer-1', description: 'Designer toolbar components render for designer role', category: 'role-designer', priority: 'high', status: 'untested', notes: '' },
  { id: 'designer-2', description: 'Designer toolbar components do NOT render for writer role', category: 'role-designer', priority: 'high', status: 'untested', notes: '' },
  { id: 'designer-3', description: 'Designer-specific controls function properly', category: 'role-designer', priority: 'medium', status: 'untested', notes: '' },
  { id: 'designer-4', description: 'DesignerOnly component correctly shows content for designer role only', category: 'role-designer', priority: 'high', status: 'untested', notes: '' },
  
  // Role-based hooks and components
  { id: 'hooks-1', description: 'useIsWriter correctly identifies writer role', category: 'hooks', priority: 'high', status: 'untested', notes: '' },
  { id: 'hooks-2', description: 'useIsWriter correctly identifies legacy editor role', category: 'hooks', priority: 'high', status: 'untested', notes: '' },
  { id: 'hooks-3', description: 'useIsDesigner correctly identifies designer role', category: 'hooks', priority: 'high', status: 'untested', notes: '' },
  { id: 'hooks-4', description: 'WriterOnly component shows content for writer role', category: 'hooks', priority: 'high', status: 'untested', notes: '' },
  { id: 'hooks-5', description: 'DesignerOnly component shows content for designer role', category: 'hooks', priority: 'high', status: 'untested', notes: '' },
  { id: 'hooks-6', description: 'AdminOnly component shows content for admin role', category: 'hooks', priority: 'medium', status: 'untested', notes: '' },
  { id: 'hooks-7', description: 'MultiRoleOnly component works with an array of roles', category: 'hooks', priority: 'medium', status: 'untested', notes: '' },
  
  // Integration tests
  { id: 'integration-1', description: 'Toolbar renders properly when role is changed dynamically', category: 'integration', priority: 'high', status: 'untested', notes: '' },
  { id: 'integration-2', description: 'Role-specific components update when role changes', category: 'integration', priority: 'high', status: 'untested', notes: '' },
  { id: 'integration-3', description: 'Role-based permissions apply correctly across the application', category: 'integration', priority: 'high', status: 'untested', notes: '' },
];
