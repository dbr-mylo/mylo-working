
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Clear any cached data in localStorage
const clearCache = () => {
  try {
    // Text styles storage
    localStorage.removeItem('text-styles');
    
    // Document storage
    localStorage.removeItem('designerDocuments');
    localStorage.removeItem('editorDocuments');
    
    // Preview preferences
    localStorage.removeItem('designerPreviewVisible');
    
    // Also clear any other potential cached items
    localStorage.removeItem('text-style-default');
    localStorage.removeItem('text-style-applied');
    
    console.log('Application cache cleared successfully');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

// Clear the cache
clearCache();

// Add timestamp as a cache-busting query parameter
const appVersion = Date.now();
console.log(`App loaded with version: ${appVersion}`);

createRoot(document.getElementById("root")!).render(<App key={`app-${appVersion}`} />);
