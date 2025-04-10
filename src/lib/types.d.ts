
// This file serves as a type declaration file that extends the types from types.ts
// It allows for TypeScript to recognize these types globally without explicit imports

import {
  UserRole,
  User,
  UserPreferences,
  Document,
  DocumentMeta,
  Project,
  Folder,
  SearchQuery,
  SearchFilters,
  DateRange,
  SortOption,
  UseDocumentReturn,
  EditorNavProps
} from './types';

// Add any additional typings or interfaces that need to be globally available here

// Re-export everything for global availability
export {
  UserRole,
  User,
  UserPreferences,
  Document,
  DocumentMeta,
  Project,
  Folder,
  SearchQuery,
  SearchFilters,
  DateRange,
  SortOption,
  UseDocumentReturn,
  EditorNavProps
};
